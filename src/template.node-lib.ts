import { Template } from "./core.types/template"

export default {
  name: "Node Library",
  init: {
    features: {
      required: ["base", "node", "api"],
      ask: ["ci", "githooks", "lint", "test", "typescript"],
    },
  },
} as Template
