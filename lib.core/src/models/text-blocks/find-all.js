/* eslint-disable no-await-in-loop */
/** @typedef {import("./model.js").TextBlock} TextBlock */

import {
  getAllFilePaths,
  readJSONFromFile,
  isMatch,
  getEnvironmentVariable,
} from "@z3r0boot/pure-utils"

/**
 * Find many TextBlocks
 * @param {object} [options]
 * @param {Partial<TextBlock>} [options.where]
 * @returns {Promise<TextBlock[]>}
 */
export const findAllTextBlocks = async ({ where } = {}) => {
  const folder = getEnvironmentVariable("ZB_EMBEDDINGS_HOME")
  const ignoreFile = getEnvironmentVariable("ZB_IGNORE_FILE")

  return getAllFilePaths(folder, { ignoreFile }).then(async files => {
    /** @type {TextBlock[]} */
    const result = []

    for (const file of files) {
      const textBlock = /** @type {TextBlock} */ (await readJSONFromFile(file))

      if (!where || (where && isMatch(where, textBlock))) {
        result.push(textBlock)
      }
    }

    return result
  })
}
