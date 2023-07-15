import { Message, findAllMessages, createMessage } from "@z3r0boot/core/models"
import { createContext, useState, useCallback, useMemo } from "react"

import { FCWithChildren } from "../core.types/react.js"

type MessagesContext = [
  {
    messages: Message[]
  },
  {
    createMessage: typeof createMessage
    findAllMessages: typeof findAllMessages
  }
]

export const messagesContext = createContext<MessagesContext | undefined>(
  undefined
)

export const MessagesProvider: FCWithChildren = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])

  const handleFindAll = useCallback<MessagesContext[1]["findAllMessages"]>(
    (...parameters) =>
      findAllMessages(...parameters).then(items => {
        setMessages(items)
        return items
      }),
    []
  )

  const handleCreateMessage = useCallback<MessagesContext[1]["createMessage"]>(
    (...parameters) =>
      createMessage(...parameters).then(item => {
        setMessages(items => [...items, item])
        return item
      }),
    []
  )

  const value = useMemo<MessagesContext>(
    () => [
      {
        messages: messages.sort((a, b) => {
          return a.createdAt > b.createdAt ? 1 : -1
        }),
      },
      {
        findAllMessages: handleFindAll,
        createMessage: handleCreateMessage,
      },
    ],
    [messages, handleCreateMessage, handleFindAll]
  )

  return (
    <messagesContext.Provider value={value}>
      {children}
    </messagesContext.Provider>
  )
}
