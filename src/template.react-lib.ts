import { Template } from "./core.types/template"

export default {
  name: "React Library",
  init: {
    features: {
      required: ["base", "react"],
      ask: ["ci", "test", "typescript", "lint"],
    },
  },
} as Template
