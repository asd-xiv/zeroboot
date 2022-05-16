import { Template } from "./core.types/template"

export default {
  name: "Node API",
  init: {
    chunks: {
      required: ["base", "node", "api"],
      optional: ["ci", "lint", "test", "typescript"],
    },
  },
} as Template
