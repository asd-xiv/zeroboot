import { Header, Tabs } from "@z3r0boot/ink-ui"
import {
  useMount,
  usePersistentState,
  useTerminalSize,
} from "@z3r0boot/ink-ui/hooks"
import { Box, Text, useApp, useFocusManager } from "ink"
import { FC } from "react"

import z3r0boot from "../package.json" assert { type: "json" }

import { Conversation } from "./container.conversation/conversation.js"
import { Footer } from "./container.footer/footer.js"
import { History } from "./container.history/history.js"
import { Prompt } from "./container.prompt/prompt.js"
import { useConversations } from "./data.conversations/use-conversations.js"

export const Z3rOb00tTUI: FC = () => {
  const { exit } = useApp()
  const { focusNext } = useFocusManager()
  const [width, height] = useTerminalSize()
  const [{ tabId }, setAppState] = usePersistentState("app-state", {
    tabId: "prompt",
  })
  const [, { findAllConversations }] = useConversations()

  useMount(() => {
    findAllConversations()
    focusNext()
  })

  return (
    <>
      <Header level={1}>
        {z3r0boot.name} v{z3r0boot.version}
      </Header>
      <Conversation
        marginY={1}
        height={height - 13}
        overflow="hidden"
        backgroundColor="red"
      />
      <Tabs
        value={tabId}
        options={{
          "prompt": "Prompt",
          "stats": "Stats",
          "choose-conversation": "Choose Conversation",
        }}
        onChange={value => setAppState({ tabId: value })}
      />
      {tabId === "prompt" ? (
        <Prompt height={3} />
      ) : tabId === "stats" ? (
        <Box>
          <Text>Stats</Text>
        </Box>
      ) : tabId === "choose-conversation" ? (
        <History />
      ) : undefined}
      <Footer
        shortcuts={[
          {
            key: "c",
            label: "Quit",
            handler: () => exit(),
          },
        ]}
      />
    </>
  )
}
