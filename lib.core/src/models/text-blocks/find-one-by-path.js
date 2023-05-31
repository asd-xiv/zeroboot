/* eslint-disable no-await-in-loop */
/** @typedef {import("./model.js").TextBlock} TextBlock */
/** @typedef {import("./model.js").TextBlockFields} TextBlockFields */

import { join } from "node:path"
import {
  readJSONFromFile,
  getEnvironmentVariable,
  canReadFile,
} from "@z3r0boot/pure-utils"

/**
 * Find (might not) an TextBlock by its path
 * @param {string} path
 * @returns {Promise<TextBlock | undefined>}
 */
export const findOneTextBlockByPath = async path => {
  const textBlocksPath = join(getEnvironmentVariable("ZB_DATABASE_HOME"), path)

  if (await canReadFile(textBlocksPath)) {
    const result = /** @type {TextBlock} */ (
      await readJSONFromFile(textBlocksPath)
    )

    return result
  }

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined
}
