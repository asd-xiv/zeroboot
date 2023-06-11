import { Text, Box as InkBox, BoxProps as InkBoxProps } from "ink"

import { FCWithChildren } from "../../types/react.js"

export type BoxProps = {
  title?: string
  isFocused?: boolean
} & InkBoxProps

export const Box: FCWithChildren<BoxProps> = ({
  title,
  isFocused,
  children,
  ...restProps
}) => {
  const borderStyle = "round" // isFocused ? restProps.borderStyle ?? "round" : undefined
  const borderColour = isFocused ? "yellowBright" : undefined
  const padding = borderStyle ? 0 : 1

  return (
    <InkBox
      borderStyle={borderStyle}
      borderColor={borderColour}
      padding={padding}
      width="100%"
      flexDirection="column"
      overflow="hidden"
      {...restProps}>
      {title && isFocused && (
        <InkBox marginTop={isFocused ? -1 : 0} height={1} overflow="hidden">
          <Text color="yellowBright">{`[ ${title} ]`}</Text>
        </InkBox>
      )}
      {children}
    </InkBox>
  )
}
