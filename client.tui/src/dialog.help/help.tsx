import { Newline, Text } from "ink"
import { FC } from "react"

import { Dialog } from "../core.ui/dialog.js"

export const HelpDialog: FC = () => {
  return (
    <Dialog title="Help" size="wide" maxHeight={20} maxWidth={80}>
      {[
        "PROMPT_PATH",
        "LOG_PATH",
        "CONVERSATIONS_HOME",
        "COMPLETIONS_HOME",
      ].map(variable => (
        <>
          <Text>
            {variable}={process.env[variable]}
          </Text>
          <Newline />
        </>
      ))}
    </Dialog>
  )
}
