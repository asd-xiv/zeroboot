import { readFile } from "node:fs/promises"

/**
 * @param {object} input
 * @param {string} input.file
 * @returns {Promise<Record<string, any>>}
 */
export const textProcessor = async ({ file }) => {
  const content = await readFile(file, "utf8")

  return {
    processor: "text",
    description: "File content",
    content,
    meta: {},
  }
}
