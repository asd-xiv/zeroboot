/**
 * @typedef {object} Conversation
 * @property {string} id
 * @property {string} model
 * @property {string} [topic]
 * @property {string} [identity]
 * @property {string} [createdAt]
 */

export const ConversationSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  name: "Conversation",
  type: "object",
  properties: {
    id: { type: "string" },
    model: { type: "string" },
    topic: { type: "string" },
    identity: { type: "string" },
    createdAt: { type: "string" },
  },
  required: ["id", "model"],
  additionalProperties: false,
}
