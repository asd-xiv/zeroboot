import { useContext } from "react"
import { messagesContext } from "./provider.js"

export const useMessages = () => {
  const context = useContext(messagesContext)

  if (context === undefined) {
    throw new Error("useMessages must be used within a ConversationsProvider")
  }

  return context
}
