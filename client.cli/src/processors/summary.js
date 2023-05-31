import { readFile } from "node:fs/promises"
import { summarize } from "@z3r0boot/core/agents"

/**
 * @param {object} input
 * @param {string} input.file
 * @returns {Promise<Record<string, any>>}
 */
export const summaryProcessor = async ({ file }) => {
  const fileContent = await readFile(file, "utf8")
  const summary = await summarize({
    path: file,
    content: fileContent,
  })

  return {
    processor: "summary",
    description: "Summary of file content",
    content: summary,
    meta: {},
  }
}
