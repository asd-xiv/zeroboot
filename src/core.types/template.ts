export type Template = {
  name: string
  init: {
    chunks: {
      required: string[]
      optional: string[]
    }
  }
}
