import { Box, BoxProps, InputText, InputTextProps } from "@z3r0boot/ink-ui"
import { usePersistentState } from "@z3r0boot/ink-ui/hooks"
import { getOpenAIClient } from "@z3r0boot/pure-utils"
import { useFocus } from "ink"
import { useCallback, useState } from "react"

import { getWith } from "../core.libs/find-with.js"
import { pick } from "../core.libs/pluck.js"
import { FCWithChildren } from "../core.types/react.js"
import { useConversations } from "../data.conversations/use-conversations.js"
import { useMessages } from "../data.messages/use-messages.js"

const OPENAI_CLIENT = getOpenAIClient()

export type PromptProps = {
  conversationId?: string
  onSubmit?: (value: string) => void
} & Omit<BoxProps, "isFocused">

export const Prompt: FCWithChildren<PromptProps> = ({
  conversationId,
  onSubmit,
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const { isFocused } = useFocus({ id: "prompt" })

  const [{ messages }, { createMessage }] = useMessages()
  const [{ conversations }] = useConversations()
  const [{ value }, setPrompt] = usePersistentState("prompt-input-value", {
    value: "",
  })

  const handleSubmit = useCallback<InputTextProps["onSubmit"]>(
    async input => {
      const conversation = getWith({ id: conversationId }, conversations)
      const message = await createMessage({
        conversationId,
        role: "user",
        content: input,
      })

      setIsLoading(true)

      const aiResponse = await OPENAI_CLIENT.createChatCompletion({
        model: conversation.model,
        messages: [...messages, message].map(item =>
          pick(["content", "role"], item)
        ),
      })

      await createMessage({
        conversationId,
        role: "assistant",
        content: aiResponse.data.choices[0]?.message?.content,
      })

      setIsLoading(false)
      setPrompt({ value: "" })
    },
    [conversationId, conversations, messages, createMessage, setPrompt]
  )

  return (
    <Box isFocused={isFocused} {...rest}>
      <InputText
        value={value}
        isFocused={isFocused}
        onChange={nextValue => {
          setPrompt({ value: nextValue })
        }}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
