/** @typedef {import("./model.js").Message } Message */

import { randomUUID } from "node:crypto"
import { join } from "node:path"
import { getEnvironmentVariable, writeJSONToFile } from "@z3r0boot/pure-utils"

/**
 * Create a Message and return it's content
 * @param {Omit<Message, "id" | "createdAt">} input
 * @returns {Promise<Message>}
 */
export const createMessage = async input => {
  const message = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  }

  await writeJSONToFile(
    {
      path: join(
        getEnvironmentVariable("ZB_DATABASE_HOME"),
        "messages",
        `${message.id}.json`
      ),
    },
    message
  )

  return message
}
