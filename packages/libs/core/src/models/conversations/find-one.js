/** @typedef {import("./model.js").Conversation} Conversation */

import { join } from "node:path"
import { getEnvironmentVariable, readJSONFromFile } from "@z3r0boot/pure-utils"

/**
 * Find (might not) a Conversation file and return it's content
 * @param {string} id
 * @returns {Promise<Conversation | undefined>}
 */
export const findOneConversation = id =>
  readJSONFromFile(
    join(
      getEnvironmentVariable("ZB_DATABASE_HOME"),
      "conversations",
      `${id}.json`
    )
  )
    .then(data => /** @type {Conversation} */ (data))
    .catch(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined
    })

/**
 * Retrieve a Conversation file and return it's content
 * @param {string} id
 * @returns {Promise<Conversation>}
 */
export const getOneConversation = id =>
  readJSONFromFile(
    join(
      getEnvironmentVariable("ZB_DATABASE_HOME"),
      "conversations",
      `${id}.json`
    )
  )
