import { Box, BoxProps, Text, TextProps } from "ink"

import { FCWithChildren } from "../../types/react.js"

export type HeaderProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6
  color?: TextProps["color"]
} & BoxProps

export const Header: FCWithChildren<HeaderProps> = ({
  children,
  level,
  color = "yellow",
  ...rest
}) => {
  return (
    <Box {...rest}>
      <Text bold={true} color={color}>
        {Array.from({ length: level }).fill("#").join("")} {children}
      </Text>
    </Box>
  )
}
