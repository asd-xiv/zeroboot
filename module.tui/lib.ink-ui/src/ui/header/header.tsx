import { Text, TextProps } from "ink"

import { FCWithChildren } from "../../types/react.js"

type HeaderProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6
} & TextProps

export const Header: FCWithChildren<HeaderProps> = ({
  children,
  level,
  color = "yellow",
  ...rest
}) => {
  return (
    <Text bold={true} color={color} {...rest}>
      {Array.from({ length: level }).fill("#").join("")} {children}
    </Text>
  )
}
