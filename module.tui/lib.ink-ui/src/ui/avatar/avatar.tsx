import { Text, TextProps } from "ink"
import { FC } from "react"

export type AvatarProps = {
  name?: string
  icon?: string
} & TextProps

export const Avatar: FC<AvatarProps> = ({ icon = "", name = "", ...rest }) => (
  <Text {...rest}>{`${icon} ${name}`}</Text>
)
