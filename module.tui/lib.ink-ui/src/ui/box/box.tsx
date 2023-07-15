import { Box as InkBox, BoxProps as InkBoxProps } from "ink"

import { FCWithChildren } from "../../types/react.js"
import { Header } from "../index.js"

export type BoxProps = {
  title?: string
  isFocused?: boolean
} & InkBoxProps

export const Box: FCWithChildren<BoxProps> = ({
  title,
  height,
  isFocused,
  children,
  ...rest
}) => {
  const borderStyle = rest.borderStyle ?? "round"
  const borderColour = isFocused ? "yellowBright" : undefined
  const padding = borderStyle ? 0 : 1

  return (
    <InkBox
      borderStyle={borderStyle}
      borderColor={borderColour}
      padding={padding}
      height={borderStyle && typeof height === "number" ? height + 2 : height}
      flexDirection="column"
      {...rest}>
      {title && isFocused && (
        <Header marginTop={borderStyle ? -1 : 0} level={2}>
          {title}
        </Header>
      )}
      {children}
    </InkBox>
  )
}
