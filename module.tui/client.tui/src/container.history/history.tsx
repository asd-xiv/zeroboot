import { Box, BoxProps } from "@z3r0boot/ink-ui"
import { useFocus } from "@z3r0boot/ink-ui/hooks"
import { useInput } from "ink"

import { findIndexWith } from "../core.libs/find-index-with.js"
import { FCWithChildren } from "../core.types/react.js"
import { useConversations } from "../data.conversations/use-conversations.js"
import { Item } from "./ui/item.js"

type HistoryProps = {} & Omit<BoxProps, "overflow" | "flexDirection">

export const History: FCWithChildren<HistoryProps> = ({ ...props }) => {
  const [{ conversations, selectedConversationId }, { selectConversation }] =
    useConversations()
  const { isFocused } = useFocus()

  useInput(
    (_input, key) => {
      const currentIndex = findIndexWith(
        { id: selectedConversationId },
        conversations
      )

      if (key.upArrow) {
        const previousItem = conversations[currentIndex - 1]

        if (previousItem) {
          selectConversation(previousItem.id)
        }
      }

      if (key.downArrow) {
        const nextItem = conversations[currentIndex + 1]

        if (nextItem) {
          selectConversation(nextItem.id)
        }
      }
    },
    {
      isActive: isFocused && conversations.length !== 0,
    }
  )

  return (
    <Box isFocused={isFocused} {...props}>
      {conversations.map(conversation => (
        <Item
          key={conversation.id}
          label={conversation.topic ?? conversation.id}
          isSelected={selectedConversationId === conversation.id}
        />
      ))}
    </Box>
  )
}
