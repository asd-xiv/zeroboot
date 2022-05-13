import { Template } from "./core.types/template"

export default {
  name: "Node API",
  init: {
    features: {
      required: ["base", "node"],
      ask: ["ci", "githooks", "lint", "test", "typescript"],
    },
  },
} as Template
