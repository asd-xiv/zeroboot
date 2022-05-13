export type Template = {
  name: string
  init: {
    features: {
      required: string[]
      ask: string[]
    }
  }
}
