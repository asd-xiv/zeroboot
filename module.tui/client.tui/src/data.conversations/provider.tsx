import {
  Conversation,
  findAllConversations,
  findOneConversation,
} from "@z3r0boot/core/models"
import { createContext, useState, useCallback, useMemo } from "react"

import { upsertWith } from "../core.libs/upsert-with.js"
import { FCWithChildren } from "../core.types/react.js"

type ConversationsContext = [
  {
    conversations: Conversation[]
    selectedConversationId?: string
  },
  {
    findAllConversations: typeof findAllConversations
    findOneConversation: typeof findOneConversation
    selectConversation: (id?: string) => void
  }
]

export const conversationsContext = createContext<
  ConversationsContext | undefined
>(undefined)

export const ConversationsProvider: FCWithChildren = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const handleFindAll = useCallback<
    ConversationsContext[1]["findAllConversations"]
  >(
    (...parameters) =>
      findAllConversations(...parameters).then(items => {
        setConversations(items)
        return items
      }),
    []
  )

  const handleFindOne = useCallback<
    ConversationsContext[1]["findOneConversation"]
  >(
    (...parameters) =>
      findOneConversation(...parameters).then(item => {
        if (item) {
          setConversations(items => upsertWith({ id: item.id }, item, items))
        }

        return item
      }),
    []
  )

  const value = useMemo<ConversationsContext>(
    () => [
      {
        conversations: conversations.sort((a, b) => {
          if (a.updatedAt > b.updatedAt) {
            return -1
          }
          if (a.updatedAt < b.updatedAt) {
            return 1
          }
          return 0
        }),
        selectedConversationId: selectedId,
      },
      {
        selectConversation: setSelectedId,
        findAllConversations: handleFindAll,
        findOneConversation: handleFindOne,
      },
    ],
    [conversations, selectedId, handleFindAll, handleFindOne]
  )

  return (
    <conversationsContext.Provider value={value}>
      {children}
    </conversationsContext.Provider>
  )
}
