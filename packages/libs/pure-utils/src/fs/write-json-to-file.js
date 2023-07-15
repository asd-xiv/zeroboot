import { writeToFile } from "./write-to-file.js"

/**
 * @param {object} options
 * @param {string} options.path
 * @param {Record<string, any>} input
 * @returns {Promise<void>}
 */
export const writeJSONToFile = ({ path }, input) =>
  writeToFile({ path }, JSON.stringify(input, undefined, 2))
