import { Conversation, findAllConversations } from "@z3r0boot/core/models"
import { createContext, useState, useCallback, useMemo } from "react"

import { FCWithChildren } from "../core.types/react.js"

type ConversationsContext = [
  {
    conversations: Conversation[]
  },
  {
    findAllConversations: () => void
  }
]

export const conversationsContext = createContext<
  ConversationsContext | undefined
>(undefined)

export const ConversationsProvider: FCWithChildren = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const handleFindAll = useCallback(() => {
    findAllConversations().then(setConversations)
  }, [])

  const value = useMemo<ConversationsContext>(
    () => [
      {
        conversations,
      },
      {
        findAllConversations: handleFindAll,
      },
    ],
    [conversations, handleFindAll]
  )

  return (
    <conversationsContext.Provider value={value}>
      {children}
    </conversationsContext.Provider>
  )
}
