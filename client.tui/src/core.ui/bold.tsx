import { Text } from "ink"

import { FCWithChildren } from "../core.types/react.js"

export const Bold: FCWithChildren = ({ children }) => {
  return <Text bold={true}>{children}</Text>
}
