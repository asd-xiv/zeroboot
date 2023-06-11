import { Box, BoxProps } from "@z3r0boot/ink-ui"
import { useMount } from "@z3r0boot/ink-ui/hooks"
import { useFocus, useInput } from "ink"

import { findIndexWith } from "../core.libs/find-index-with.js"
import { FCWithChildren } from "../core.types/react.js"
import { useConversations } from "../data.conversations/use-conversations.js"
import { Item } from "./ui/item.js"

type HistoryProps = {
  selectedId?: string
  isDisabled?: boolean
  onChange?: (id: string) => void
} & Omit<BoxProps, "overflow" | "flexDirection">

export const History: FCWithChildren<HistoryProps> = ({
  selectedId,
  onChange,
  ...restProps
}) => {
  const [{ conversations }, { findAllConversations }] = useConversations()
  const { isFocused } = useFocus()

  useMount(() => {
    findAllConversations()
  })

  useInput((_input, key) => {
    if (!isFocused || conversations.length === 0) {
      return
    }

    const currentIndex = findIndexWith({ id: selectedId }, conversations)

    if (key.upArrow) {
      const previousItem = conversations[currentIndex - 1]

      if (previousItem) {
        onChange?.(previousItem.id)
      }
    }

    if (key.downArrow) {
      const nextItem = conversations[currentIndex + 1]

      if (nextItem) {
        onChange?.(nextItem.id)
      }
    }
  })

  return (
    <Box isFocused={isFocused} {...restProps}>
      {conversations.map(conversation => (
        <Item
          key={conversation.id}
          label={conversation.topic ?? conversation.id}
          isSelected={selectedId === conversation.id}
        />
      ))}
    </Box>
  )
}
