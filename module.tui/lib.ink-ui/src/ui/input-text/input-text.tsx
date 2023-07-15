import chalk from "chalk"
import { Text, useInput } from "ink"
import { useState, useEffect } from "react"
import { FCWithChildren } from "../../types/react.js"

export type InputTextProps = {
  placeholder?: string
  isFocused?: boolean // eslint-disable-line react/boolean-prop-naming
  mask?: string
  showCursor?: boolean // eslint-disable-line react/boolean-prop-naming
  highlightPastedText?: boolean // eslint-disable-line react/boolean-prop-naming
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export const InputText: FCWithChildren<InputTextProps> = ({
  value: originalValue,
  placeholder = "",
  isFocused = true,
  mask = "",
  highlightPastedText = false,
  showCursor = true,
  onChange,
  onSubmit,
}: InputTextProps) => {
  const [state, setState] = useState({
    cursorOffset: (originalValue || "").length,
    cursorWidth: 0,
  })

  const { cursorOffset, cursorWidth } = state

  useEffect(() => {
    setState(previousState => {
      if (!isFocused || !showCursor) {
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
  }, [originalValue, isFocused, showCursor])

  const cursorActualWidth = highlightPastedText ? cursorWidth : 0

  const value = mask ? mask.repeat(originalValue.length) : originalValue
  let renderedValue = value
  let renderedPlaceholder = placeholder ? chalk.grey(placeholder) : undefined

  // Fake mouse cursor, because it's too inconvenient to deal with actual cursor and ansi escapes
  if (showCursor && isFocused) {
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
        if (showCursor) {
          nextCursorOffset -= 1
        }
      } else if (key.rightArrow) {
        if (showCursor) {
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
    { isActive: isFocused }
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
