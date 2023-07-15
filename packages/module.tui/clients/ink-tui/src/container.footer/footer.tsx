import { Box, Text, useInput } from "ink"
import { FC } from "react"

export type FooterProps = {
  shortcuts: {
    key: string
    label: string
    handler: () => void
  }[]
}

export const Footer: FC<FooterProps> = ({ shortcuts, ...rest }) => {
  useInput(input => {
    for (const shortcut of shortcuts) {
      if (shortcut.key === input) {
        shortcut.handler()
      }
    }
  }, {})

  return (
    <Box {...rest}>
      {shortcuts.map(({ key, label }) => (
        <Text key={`footer-${key}`}>
          {key}{" "}
          <Text dimColor={true} inverse={true}>
            {label}
          </Text>
          {` `}
        </Text>
      ))}
    </Box>
  )
}
