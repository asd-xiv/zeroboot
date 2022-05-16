import { Template } from "./core.types/template"

export default {
  name: "Node Library",
  init: {
    chunks: {
      required: ["base", "node"],
      optional: ["ci", "lint", "test", "typescript"],
    },
  },
} as Template
