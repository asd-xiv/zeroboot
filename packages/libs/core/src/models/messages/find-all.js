/* eslint-disable no-await-in-loop */
/** @typedef {import("./model.js").Message} Message */

import { join } from "node:path"
import {
  getAllFilePaths,
  readJSONFromFile,
  isMatch,
  getEnvironmentVariable,
} from "@z3r0boot/pure-utils"

/**
 * Find multiple Messages
 * @param {object} [options]
 * @param {Partial<Message>} [options.where]
 * @returns {Promise<Message[]>}
 */
export const findAllMessages = async ({ where } = {}) => {
  const folder = join(getEnvironmentVariable("ZB_DATABASE_HOME"), "messages")

  return getAllFilePaths(folder).then(async files => {
    /** @type {Message[]} */
    const result = []

    for (const file of files) {
      const message = /** @type {Message} */ (await readJSONFromFile(file))

      if (!where || (where && isMatch(where, message))) {
        result.push(message)
      }
    }

    return result
  })
}
