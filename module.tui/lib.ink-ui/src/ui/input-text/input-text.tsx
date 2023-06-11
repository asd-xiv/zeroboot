import chalk from "chalk"
import { Text, useFocus, useInput } from "ink"
import { useState, useEffect, useId } from "react"

import { useInputManager } from "../../hooks/use-input-manager/use-input-manager.js"
import { FCWithChildren } from "../../types/react.js"

export type Props = {
  id?: string
  value: string
  placeholder?: string
  mask?: string
  shouldShowCursor?: boolean
  shouldHighlightPastedText?: boolean
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
}

export const InputText: FCWithChildren<Props> = ({
  id,
  value: originalValue,
  placeholder = "",
  mask,
  shouldHighlightPastedText = false,
  shouldShowCursor = true,
  onChange,
  onSubmit,
}) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const { activeInputId, setActiveInputId } = useInputManager()
  const { isFocused } = useFocus({ id: inputId })

  useEffect(() => {
    if (isFocused && inputId !== activeInputId) {
      setActiveInputId(inputId)
    }
  }, [id, inputId, activeInputId, isFocused, setActiveInputId])

  const [{ cursorOffset, cursorWidth }, setState] = useState({
    cursorOffset: (originalValue || "").length,
    cursorWidth: 0,
  })

  useEffect(() => {
    setState(previousState => {
      if (!isFocused || !shouldShowCursor) {
        return previousState
      }

      const newValue = originalValue || ""

      if (previousState.cursorOffset > newValue.length - 1) {
        return {
          cursorOffset: newValue.length,
          cursorWidth: 0,
        }
      }

      return previousState
    })
  }, [originalValue, isFocused, shouldShowCursor])

  const cursorActualWidth = shouldHighlightPastedText ? cursorWidth : 0

  const value = mask ? mask.repeat(originalValue.length) : originalValue
  let renderedValue = value
  let renderedPlaceholder = placeholder ? chalk.grey(placeholder) : undefined

  // Fake mouse cursor, because it's too inconvenient to deal with actual cursor and ansi escapes
  if (shouldShowCursor && isFocused) {
    renderedPlaceholder =
      placeholder.length === 0
        ? chalk.inverse(" ")
        : chalk.inverse(placeholder[0]) + chalk.grey(placeholder.slice(1))

    renderedValue = value.length === 0 ? chalk.inverse(" ") : ""

    let index = 0

    for (const char of value) {
      renderedValue +=
        index >= cursorOffset - cursorActualWidth && index <= cursorOffset
          ? chalk.inverse(char)
          : char

      index += 1
    }

    if (value.length !== 0 && cursorOffset === value.length) {
      renderedValue += chalk.inverse(" ")
    }
  }

  useInput(
    (input, key) => {
      if (
        key.upArrow ||
        key.downArrow ||
        (key.ctrl && input === "c") ||
        key.tab ||
        (key.shift && key.tab)
      ) {
        return
      }

      if (key.return) {
        if (onSubmit) {
          onSubmit(originalValue)
        }

        return
      }

      let nextCursorOffset = cursorOffset
      let nextValue = originalValue
      let nextCursorWidth = 0

      if (key.leftArrow) {
        if (shouldShowCursor) {
          nextCursorOffset -= 1
        }
      } else if (key.rightArrow) {
        if (shouldShowCursor) {
          nextCursorOffset += 1
        }
      } else if (key.backspace || key.delete) {
        if (cursorOffset > 0) {
          nextValue =
            originalValue.slice(0, cursorOffset - 1) +
            originalValue.slice(cursorOffset, originalValue.length)

          nextCursorOffset -= 1
        }
      } else {
        nextValue =
          originalValue.slice(0, cursorOffset) +
          input +
          originalValue.slice(cursorOffset, originalValue.length)

        nextCursorOffset += input.length

        if (input.length > 1) {
          nextCursorWidth = input.length
        }
      }

      if (cursorOffset < 0) {
        nextCursorOffset = 0
      }

      if (cursorOffset > originalValue.length) {
        nextCursorOffset = originalValue.length
      }

      setState({
        cursorOffset: nextCursorOffset,
        cursorWidth: nextCursorWidth,
      })

      if (nextValue !== originalValue) {
        onChange(nextValue)
      }
    },
    {
      isActive: inputId === activeInputId,
    }
  )

  return (
    <Text>
      {placeholder
        ? value.length === 0
          ? renderedPlaceholder
          : renderedValue
        : renderedValue}
    </Text>
  )
}
