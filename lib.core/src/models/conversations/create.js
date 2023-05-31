/** @typedef {import("./model.js").Conversation} Conversation */

import { randomUUID } from "node:crypto"
import { join } from "node:path"
import { writeJSONToFile, getEnvironmentVariable } from "@z3r0boot/pure-utils"

/**
 * @param {Partial<Conversation>} input
 * @returns {Promise<Conversation>}
 */
export const createConversation = async input => {
  const conversation = /** @type {Conversation} */ ({
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: new Date().toISOString(),
  })

  await writeJSONToFile(
    {
      path: join(
        getEnvironmentVariable("ZB_DATABASE_HOME"),
        "conversations",
        conversation.id
      ),
    },
    conversation
  )

  return conversation
}
