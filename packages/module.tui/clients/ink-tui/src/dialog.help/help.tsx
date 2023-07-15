import { Box } from "@z3r0boot/ink-ui"
import { Text, useFocus } from "ink"
import { FC } from "react"

export type HelpProps = {}

export const Help: FC<HelpProps> = () => {
  const { isFocused } = useFocus()

  return (
    <Box title="Help" isFocused={isFocused}>
      {[
        "PROMPT_PATH",
        "LOG_PATH",
        "CONVERSATIONS_HOME",
        "COMPLETIONS_HOME",
      ].map(variable => (
        <Text key={variable}>
          {variable}={process.env[variable]}
        </Text>
      ))}
    </Box>
  )
}
