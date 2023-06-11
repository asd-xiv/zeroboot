import { Box, BoxProps } from "@z3r0boot/ink-ui"
import { Text, useFocus } from "ink"

import { FCWithChildren } from "../core.types/react.js"

type ConversationProps = {
  id?: string
} & Omit<BoxProps, "overflow" | "flexDirection">

export const Conversation: FCWithChildren<ConversationProps> = ({
  id,
  ...rest
}) => {
  const { isFocused } = useFocus()

  return (
    <Box title={id ?? "Conversation Details"} isFocused={isFocused} {...rest}>
      <Text>Lorem Ipsum</Text>
    </Box>
  )
}
