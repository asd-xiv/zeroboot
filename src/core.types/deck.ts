export type Deck = {
  name: string
  description?: string
} & ({ chunks: string[] } | { stacks: string[] })
