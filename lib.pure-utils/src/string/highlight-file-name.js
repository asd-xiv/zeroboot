import { basename, dirname } from "node:path"
import chalk from "chalk"

/**
 * Emphasize the file name by contrasting it with the rest of the path
 * @param {string} filePath
 * @returns {string}
 * @example
 * highlightFileName("src/__tests__/index.test.js")
 * // => "src/__tests__/index.test.js"
 * //    "^^^^^gray^^^^|^^^^white^^^^"
 */
export const highlightFileName = filePath => {
  const fileName = basename(filePath)
  const folderName = dirname(filePath)

  return `${chalk.gray(folderName)}/${chalk.white.bold(fileName)}`
}
