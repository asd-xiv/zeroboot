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
      P[key]["choices"] extends string[] ? P[key]["choices"][number] : string,
      Record<string, string>
    >
  }
}
