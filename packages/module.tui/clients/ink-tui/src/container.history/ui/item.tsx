import { Box, Text } from "ink"
import { FC, memo } from "react"

type ItemProps = {
  label: string
  isSelected?: boolean
}

export const Item: FC<ItemProps> = memo(({ label, isSelected }) => {
  return (
    <Box height={1} overflow="hidden">
      <Text
        wrap="truncate-end"
        backgroundColor={isSelected ? "white" : undefined}
        color={isSelected ? "black" : undefined}>
        {label}
      </Text>
    </Box>
  )
})
