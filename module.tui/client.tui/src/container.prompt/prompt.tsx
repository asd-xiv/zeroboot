import { Box, BoxProps, InputText } from "@z3r0boot/ink-ui"
import { useInputManager } from "@z3r0boot/ink-ui/hooks"
import { useFocus, useFocusManager } from "ink"

import { useState } from "react"
import { FCWithChildren } from "../core.types/react.js"

export type PromptProps = {
  conversationId?: string
  onSubmit: (value: string) => void
} & Omit<BoxProps, "isFocused">

export const Prompt: FCWithChildren<PromptProps> = ({
  conversationId,
  onSubmit,
  ...rest
}) => {
  const { activeInputId } = useInputManager()
  const [value, setValue] = useState("")

  console.log("activeInputId", activeInputId)

  return (
    <Box isFocused={activeInputId === "prompt"} {...rest}>
      <InputText
        id="prompt"
        value={value}
        onChange={setValue}
        onSubmit={onSubmit}
      />
    </Box>
  )
}
