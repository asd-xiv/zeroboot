import { Template } from "./core.types/template"

export default {
  name: "React Application",
  init: {
    chunks: {
      required: ["base", "react"],
      optional: ["ci", "test", "typescript", "lint"],
    },
  },
} as Template
