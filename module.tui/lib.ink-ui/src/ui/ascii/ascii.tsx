import figlet from "figlet"
import { Newline, Text } from "ink"
import { FC } from "react"

type ASCIIProps = {
  value: string
  font?: figlet.Fonts
  horizontalLayout?: figlet.KerningMethods
  verticalLayout?: figlet.KerningMethods
}

export const ASCII: FC<ASCIIProps> = ({
  value = "",
  font = "ANSI Shadow",
  horizontalLayout = "default",
  verticalLayout = "default",
}) => {
  return (
    <Text>
      {figlet.textSync(value, {
        font,
        horizontalLayout,
        verticalLayout,
      })}
      <Newline />
    </Text>
  )
}
