/** @typedef {import("./model.js").Conversation} Conversation */

import { join } from "node:path"
import { writeJSONToFile, getEnvironmentVariable } from "@z3r0boot/pure-utils"
import { findOneConversation } from "./find-one.js"

/**
 * @param {string} id
 * @param {Partial<Omit<Conversation, "id">>} data
 * @returns {Promise<Conversation>}
 */
export const updateConversation = async (id, data) => {
  const conversation = await findOneConversation(id)

  if (!conversation) {
    throw new Error("Conversation not found")
  }

  await writeJSONToFile(
    {
      path: join(
        getEnvironmentVariable("ZB_DATABASE_HOME"),
        "conversations",
        conversation.id
      ),
    },
    {
      ...conversation,
      ...data,
      updatedAt: new Date().toISOString(),
    }
  )

  return conversation
}
