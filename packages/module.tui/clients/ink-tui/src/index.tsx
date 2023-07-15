import { render } from "ink"

import "./config.environment.js"
import { Z3rOb00tTUI } from "./app.js"
import { ConversationsProvider } from "./data.conversations/provider.js"
import { MessagesProvider } from "./data.messages/provider.js"

export const startTUIApp = () =>
  render(
    <MessagesProvider>
      <ConversationsProvider>
        <Z3rOb00tTUI />
      </ConversationsProvider>
    </MessagesProvider>
  )
