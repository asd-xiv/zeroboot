import { useContext } from "react"
import { conversationsContext } from "./provider.js"

export const useConversations = () => {
  const context = useContext(conversationsContext)

  if (context === undefined) {
    throw new Error(
      "useConversations must be used within a ConversationsProvider"
    )
  }

  return context
}
