import { DistinctQuestion } from "inquirer"

export type CLIQuestions = {
  [key: string]: DistinctQuestion
}

export type Chunk<P extends CLIQuestions> = {
  name: string
  description?: string
  parameters?: P
  contentMapping?: {
    [key in keyof P]?: Record<
      P[key]["choices"] extends Array<string>
        ? P[key]["choices"][number]
        : string,
      Record<string, string>
    >
  }
}

export type Stack = {
  name: string
  parameters?: CLIQuestions
  chunks: {
    required: string[]
    optional?: string[]
  }
}

export type PackageJSON = {
  name: string
  description: string
  version: string
}

export { build } from "./cmd.build/build.js"
