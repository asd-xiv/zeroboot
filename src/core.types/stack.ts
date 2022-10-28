import { CLIQuestions } from "./chunk.js"

export type Stack = {
  name: string
  parameters?: CLIQuestions
  chunks: {
    required: string[]
    optional?: string[]
  }
}
