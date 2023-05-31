/* eslint-disable no-await-in-loop */
/** @typedef {import("./model.js").Conversation} Conversation */

import { join } from "node:path"
import {
  getAllFilePaths,
  readJSONFromFile,
  isMatch,
  getEnvironmentVariable,
} from "@z3r0boot/pure-utils"

/**
 * Find many Conversations
 * @param {object} [options]
 * @param {Partial<Conversation>} [options.where]
 * @returns {Promise<Conversation[]>}
 */
export const findAllConversations = async ({ where } = {}) => {
  const folder = join(
    getEnvironmentVariable("ZB_DATABASE_HOME"),
    "conversations"
  )

  return getAllFilePaths(folder).then(async files => {
    /** @type {Conversation[]} */
    const result = []

    for (const file of files) {
      const conversation = /** @type {Conversation} */ (
        await readJSONFromFile(file)
      )

      if (!where || (where && isMatch(where, conversation))) {
        result.push(conversation)
      }
    }

    return result
  })
}
