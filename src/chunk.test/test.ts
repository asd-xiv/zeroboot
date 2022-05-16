import { Chunk } from "../core.types/chunk"

export default {
  init: {
    name: "Test",
    ask: [
      {
        name: "library",
        type: "checkbox",
        message: "Select library",
        choices: ["Tape", "Jest"],
      },
    ],
  },
} as Chunk
