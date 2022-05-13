import { Template } from "./core.types/template"

export default {
  name: "React Single Page Application",
  init: {
    features: {
      required: ["base", "react"],
      ask: ["ci", "test", "typescript", "lint"],
    },
  },
} as Template
