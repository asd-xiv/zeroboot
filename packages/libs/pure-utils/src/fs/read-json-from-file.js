import { readFileSync } from "node:fs"
import { readFile } from "node:fs/promises"

/**
 * Read a file and parse it as JSON.
 * @template {Record<string, unknown> | undefined} T
 * @param {string} input
 * @returns {Promise<T>}
 */
export const readJSONFromFile = input =>
  readFile(input, "utf8").then(buffer => JSON.parse(buffer.toString()))

/**
 * Read a file and parse it as JSON.
 * @template {Record<string, unknown> | undefined} T
 * @param {string} input
 * @returns {T}
 */
export const readJSONFromFileSync = input =>
  JSON.parse(readFileSync(input, "utf8"))
