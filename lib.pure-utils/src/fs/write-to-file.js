import { mkdir, writeFile as nodeWriteFile } from "node:fs/promises"
import { dirname } from "node:path"

/**
 * Write data to a file while also creating parent directories if needed.
 * @param {object} options
 * @param {string} options.path
 * @param {string} input
 * @returns {Promise<void>}
 */
export const writeToFile = ({ path }, input) =>
  mkdir(dirname(path), { recursive: true }).then(() =>
    nodeWriteFile(path, input, { encoding: "utf8" })
  )
