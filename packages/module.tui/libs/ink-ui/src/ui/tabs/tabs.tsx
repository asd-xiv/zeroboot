import { Box, Text, useFocus, useFocusManager, useInput } from "ink"
import { useCallback, useMemo, useState } from "react"

import { FCWithChildren } from "../../types/react.js"

export type TabsProps = {
  value: string
  options: Record<string, string>
  onChange: (value: string) => void
}

export const Tabs: FCWithChildren<TabsProps> = ({
  value,
  options,
  onChange,
}) => {
  const [hoverOption, setHoverOption] = useState(value)
  const { focusNext } = useFocusManager()
  const { isFocused } = useFocus()

  const { values, count } = useMemo(() => {
    const keys = Object.keys(options)

    return {
      values: keys,
      count: keys.length,
    }
  }, [options])

  type UseInput = Parameters<typeof useInput>[0]
  const handleHoverKeyboardNavigation = useCallback<UseInput>(
    (_, key) => {
      if (key.rightArrow || key.leftArrow) {
        const hoverIndex = values.indexOf(hoverOption)
        const nextIndex = key.rightArrow
          ? Math.min(count - 1, hoverIndex + 1)
          : Math.max(0, hoverIndex - 1)
        const nextValue = values[nextIndex] ?? value

        setHoverOption(nextValue)
      }

      if (key.return) {
        if (value === hoverOption) {
          focusNext()
        } else {
          onChange(hoverOption)
        }
      }
    },
    [value, count, hoverOption, values, onChange, focusNext]
  )

  useInput(handleHoverKeyboardNavigation, { isActive: isFocused })

  return (
    <Box gap={1}>
      {values.map(key => {
        const isSelected = key === value
        const isHovered = key === hoverOption

        return (
          <Text
            key={key}
            color={isSelected ? "black" : undefined}
            backgroundColor={isSelected ? "yellow" : undefined}
            underline={isFocused && isHovered}>
            {options[key]}
          </Text>
        )
      })}
    </Box>
  )
}
