import { Text } from "ink"
import { FC } from "react"

export const WhoAmI: FC = () => {
  return <Text> {process.env["USER"]}</Text>
}
