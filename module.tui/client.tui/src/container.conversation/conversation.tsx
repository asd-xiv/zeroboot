import { Avatar, Box, BoxProps } from "@z3r0boot/ink-ui"
import { useFocus } from "@z3r0boot/ink-ui/hooks"
import { Text, Box as InkBox } from "ink"
import { useEffect, useMemo } from "react"

import { findWith } from "../core.libs/find-with.js"
import { FCWithChildren } from "../core.types/react.js"
import { useConversations } from "../data.conversations/use-conversations.js"
import { useMessages } from "../data.messages/use-messages.js"

type ConversationProps = {} & Omit<BoxProps, "flexDirection">

export const Conversation: FCWithChildren<ConversationProps> = props => {
  const { isFocused } = useFocus()
  const [{ messages }, { findAllMessages }] = useMessages()
  const [{ selectedConversationId, conversations }, { findOneConversation }] =
    useConversations()

  const conversation = useMemo(
    () => findWith({ id: selectedConversationId }, conversations),
    [selectedConversationId, conversations]
  )

  useEffect(() => {
    if (selectedConversationId) {
      findOneConversation(selectedConversationId)
    }
  }, [selectedConversationId, findOneConversation])

  useEffect(() => {
    if (selectedConversationId) {
      findAllMessages({ where: { conversationId: selectedConversationId } })
    }
  }, [selectedConversationId, findAllMessages])

  return conversation ? (
    <Box
      title={selectedConversationId ?? "Conversation Details"}
      borderStyle={undefined}
      isFocused={isFocused}
      {...props}>
      {messages.map(({ id: messageId, role, content }) => {
        const icon =
          role === "assistant" ? "󰧑" : role === "user" ? "👤" : undefined
        const name =
          role === "assistant"
            ? `Assistant`
            : role === "user"
            ? process.env["USER"]
            : undefined

        return (
          <InkBox key={messageId} flexDirection="column" marginBottom={1}>
            <Avatar
              name={name}
              icon={icon}
              color={role === "assistant" ? "blue" : "green"}
            />
            <Text>{content}</Text>
          </InkBox>
        )
      })}
    </Box>
  ) : undefined
}
