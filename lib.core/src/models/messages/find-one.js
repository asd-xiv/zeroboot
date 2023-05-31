/** @typedef {import("./model.js").Message } Message */

import { join } from "node:path"
import { getEnvironmentVariable, readJSONFromFile } from "@z3r0boot/pure-utils"

/**
 * Find (might not) a Message file and return it's content
 * @param {string} id
 * @returns {Promise<Message | undefined>}
 */
export const findOneMessage = id =>
  readJSONFromFile(
    join(getEnvironmentVariable("ZB_DATABASE_HOME"), "messages", `${id}.json`)
  )
    .then(data => /** @type {Message} */ (data))
    .catch(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined
    })
