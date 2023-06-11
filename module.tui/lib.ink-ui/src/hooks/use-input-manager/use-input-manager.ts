import { useContext } from "react"
import { inputManagerContext } from "./provider.js"

export const useInputManager = () => {
  const context = useContext(inputManagerContext)

  if (context === undefined) {
    throw new Error(
      "useInputManager must be used within a InputManagerProvider"
    )
  }

  return context
}
