import { Header, InputText } from "@z3r0boot/ink-ui"
import {
  InputManagerProvider,
  useMount,
  useTerminalSize,
} from "@z3r0boot/ink-ui/hooks"
import { Box, useApp, useFocusManager } from "ink"
import { FC, useState } from "react"

import { ConversationsProvider } from "../dist/data.conversations/provider.js"
import z3r0boot from "../package.json" assert { type: "json" }

import { Conversation } from "./container.conversation/conversation.js"
import { Footer } from "./container.footer/footer.js"
import { History } from "./container.history/history.js"
import { Prompt } from "./container.prompt/prompt.js"
import { Help } from "./dialog.help/help.js"




export const Z3rOb00tTUI: FC = () => {
  const { exit } = useApp()
  const [columns, rows] = useTerminalSize()
  const [selectedConversationId, setSelectedConversationId] = useState<string>()
  const [isHelpVisible, setIsHelpVisible] = useState(false)

  const { focusNext } = useFocusManager()
  useMount(() => {
    focusNext()
  })

  return (
    <InputManagerProvider>
      <ConversationsProvider>
        <Box flexDirection="column" width={columns} height={rows - 3}>
          <Header level={1}>
            {z3r0boot.name} v{z3r0boot.version}
          </Header>
          <Box flexDirection="row" flexGrow={1}>
            <History
              selectedId={selectedConversationId}
              width="30"
              minWidth={30}
              onChange={setSelectedConversationId}
            />
            <Box flexGrow={1}>
              {isHelpVisible ? (
                <Help />
              ) : (
                <Box flexGrow={1} flexDirection="column">
                  <Conversation flexGrow={1} id={selectedConversationId} />
                  <InputText
                    value="123"
                    onChange={input => console.log(input)}
                  />
                  <Prompt
                    height={5}
                    conversationId={selectedConversationId}
                    onSubmit={value => console.log(value)}
                  />
                </Box>
              )}
            </Box>
          </Box>
          <Footer
            shortcuts={
              [
                // {
                //   key: "q",
                //   label: "Quit",
                //   handler: () => exit(),
                // },
                // {
                //   key: "?",
                //   label: "Help",
                //   handler: () => setIsHelpVisible(previousValue => !previousValue),
                // },
              ]
            }
          />
        </Box>
      </ConversationsProvider>
    </InputManagerProvider>
  )
}
