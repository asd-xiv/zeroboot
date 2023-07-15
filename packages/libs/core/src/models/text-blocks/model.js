/**
 * @typedef {object} TextBlock
 * @property {string} id
 * @property {string} content
 * @property {string} description
 * @property {string} type
 * @property {string} hash
 * @property {string} [file]
 * @property {string} [fileCWD]
 * @property {number} tokens
 * @property {string} embeddingModel
 * @property {number[]} embeddingData
 * @property {object} [meta]
 * @property {string} createdAt
 */

/**
 * @typedef {keyof TextBlock} TextBlockFields
 */

export const TextBlockSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  name: "TextBlock",
  properties: {
    id: { type: "string" },
    content: { type: "string" },
    description: { type: "string" },
    type: { type: "string" },
    hash: { type: "string" },
    file: { type: "string" },
    fileCWD: { type: "string" },
    tokens: { type: "number" },
    embeddingModel: { type: "string" },
    embeddingData: { type: "array" },
    createdAt: { type: "string" },
  },
  required: [
    "id",
    "content",
    "description",
    "type",
    "hash",
    "tokens",
    "embeddingModel",
    "embeddingData",
    "createdAt",
  ],
}
