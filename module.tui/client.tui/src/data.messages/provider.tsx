import { Message, findAllMessages } from "@z3r0boot/core/models"
import { createContext, useState, useCallback, useMemo } from "react"

import { FCWithChildren } from "../core.types/react.js"

type MessagesContext = [
  {
    conversations: Message[]
  },
  {
    findAllMessages: () => void
  }
]

export const messagesContext = createContext<MessagesContext | undefined>(
  undefined
)

export const MessagesProvider: FCWithChildren = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([])

  const handleFindAll = useCallback(() => {
    findAllMessages().then(setMessages)
  }, [])

  const value = useMemo<MessagesContext>(
    () => [
      {
        conversations: messages,
      },
      {
        findAllMessages: handleFindAll,
      },
    ],
    [messages, handleFindAll]
  )

  return (
    <messagesContext.Provider value={value}>
      {children}
    </messagesContext.Provider>
  )
}
