import { readFile } from "node:fs/promises"

/**
 * Read a file and parse it as JSON.
 * @template {Record<string, unknown>} T
 * @param {string} input
 * @returns {Promise<T>}
 */
export const readJSONFromFile = input =>
  readFile(input, "utf8").then(buffer => JSON.parse(buffer.toString()))
