import { Box, BoxProps, Text } from "ink"
import { useMemo } from "react"

import { useTerminalSize } from "../core.hooks/use-terminal-size.js"
import { FCWithChildren } from "../core.types/react.js"

import { Header } from "./header.js"

export type DialogProps = {
  size: "wide" | "narrow"
  title?: string
  maxWidth?: number
  maxHeight?: number
} & BoxProps

export const Dialog: FCWithChildren<DialogProps> = ({
  children,
  size,
  title,
  maxWidth,
  maxHeight,
}) => {
  const [screenWidth, screenHeight] = useTerminalSize()
  const [width, height, top, left] = useMemo(() => {
    let dialogWidth = Math.floor(screenWidth * 0.8)
    let dialogHeight = Math.floor(screenHeight * 0.8)

    if (size === "narrow") {
      dialogWidth = Math.floor(screenWidth * 0.5)
      dialogHeight = Math.floor(screenHeight * 0.5)

      if (maxWidth && dialogWidth > maxWidth) {
        dialogWidth = maxWidth
      }
      if (maxHeight && dialogHeight > maxHeight) {
        dialogHeight = maxHeight
      }
    }

    return [
      dialogWidth,
      dialogHeight,
      Math.floor(screenHeight / 2 - dialogHeight / 2),
      Math.floor(screenWidth / 2 - dialogWidth / 2),
    ]
  }, [maxWidth, maxHeight, screenWidth, screenHeight, size])

  return (
    <Box
      borderStyle="round"
      position="absolute"
      paddingX={1}
      marginTop={top}
      marginLeft={left}
      width={width}
      height={height}>
      {title && (
        <Box position="absolute" marginTop={-1} marginLeft={1}>
          <Header level={2}>{`${title} `}</Header>
        </Box>
      )}
      <Text>{children}</Text>
    </Box>
  )
}
