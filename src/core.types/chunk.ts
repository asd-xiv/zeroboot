import { DistinctQuestion } from "inquirer"

export type Chunk = {
  init: {
    name: string
    ask: DistinctQuestion[]
  }
}
