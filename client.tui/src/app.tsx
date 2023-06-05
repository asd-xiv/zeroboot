import { randomUUID } from "node:crypto"

import { Box, Newline, Text, useApp } from "ink"
import { FC, Fragment, useCallback, useState } from "react"

import package_ from "../package.json" assert { type: "json" }

import { usePromptWatcher } from "./core.hooks/use-prompt-watcher.js"
import { useTerminalSize } from "./core.hooks/use-terminal-size.js"
import { Bold } from "./core.ui/bold.js"
import { Header } from "./core.ui/header.js"
import { WhoAmI } from "./core.ui/who-am-i.js"
import { HelpDialog } from "./dialog.help/help.js"
import { Footer } from "./layout/footer.js"

export const ComputerTUI: FC = () => {
  const [columns, rows] = useTerminalSize()
  const [isHelpVisible, setIsHelpVisible] = useState(false)
  const { exit } = useApp()
  const [prompts, setPrompts] = useState<{ id: string; value: string }[]>([])

  const handlePromptChange = useCallback((value: string) => {
    setPrompts(previousValue => [
      ...previousValue,
      {
        id: randomUUID(),
        value,
      },
    ])
  }, [])

  const handlePromptReady = useCallback(({ promptFile }) => {}, [])

  usePromptWatcher({
    onChange: handlePromptChange,
    onReady: handlePromptReady,
  })

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <Header level={1}>
        {package_.name} v{package_.version}
      </Header>
      <Box overflow="hidden" flexDirection="column" height={rows - 2}>
        {prompts.map(prompt => (
          <Box flexDirection="column" key={prompt.id}>
            <Bold>
              <WhoAmI />:
            </Bold>
            <Text>{prompt.value}</Text>
          </Box>
        ))}
      </Box>
      {isHelpVisible && <HelpDialog />}
      <Footer
        shortcuts={[
          {
            key: "q",
            label: "Quit",
            handler: () => exit(),
          },
          {
            key: "?",
            label: "Help",
            handler: () => setIsHelpVisible(previousValue => !previousValue),
          },
        ]}
      />
    </Box>
  )
}
