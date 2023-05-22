import { DistinctQuestion } from "inquirer"

export type CLIQuestions = {
  [key: string]: DistinctQuestion
}

export type Chunk<P extends Record<string, any> = DistinctQuestion> = {
  name: string
  description?: string
  parameters?: P
  chunks?: {
    name: string
    move: {
      from: string
      to: string
      mode?: string
    }[]
    exclude?: string[]
  }[]
  contentMapping?: {
    [key in keyof P]?: Record<
      P[key]["choices"] extends string[] ? P[key]["choices"][number] : string,
      Record<string, string>
    >
  }
}
