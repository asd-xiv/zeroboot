/* eslint-disable no-await-in-loop */
/** @typedef {import("./model.js").TextBlock} TextBlock */
/** @typedef {import("./model.js").TextBlockFields} TextBlockFields */

import { join } from "node:path"
import {
  readJSONFromFile,
  isMatch,
  getAllFilePaths,
  getEnvironmentVariable,
} from "@z3r0boot/pure-utils"

/**
 * Find (might not) an TextBlock
 * @param {object} input
 * @param {{type: string} & Partial<TextBlock>} input.where
 * @returns {Promise<TextBlock | undefined>}
 */
export const findOneTextBlock = async ({ where }) => {
  const folder = join(getEnvironmentVariable("ZB_DATABASE_HOME"), where.type)
  const ignoreFile = getEnvironmentVariable("ZB_IGNORE_FILE")

  return getAllFilePaths(folder, { ignoreFile }).then(async files => {
    for (const file of files) {
      const textBlock = /** @type {TextBlock} */ (await readJSONFromFile(file))

      if (isMatch(where, textBlock)) {
        return textBlock
      }
    }

    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined
  })
}
