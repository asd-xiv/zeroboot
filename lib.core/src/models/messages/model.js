/** @typedef {import("openai").ChatCompletionRequestMessage} ChatMessage */

/**
 * @typedef {object} Message
 * @property {string} id
 * @property {string} [conversationId]
 * @property {ChatMessage["role"]} role
 * @property {string} content
 * @property {string} createdAt
 */

export const MessageSchema = {
  $schema: "http://json-schema.org/draft-07/schema",
  name: "Message",
  type: "object",
  properties: {
    id: { type: "string" },
    conversationId: { type: "string" },
    role: { type: "string" },
    content: { type: "string" },
    createdAt: { type: "string" },
  },
  additionalProperties: false,
}
