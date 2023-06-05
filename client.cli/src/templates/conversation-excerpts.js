/** @typedef {import("@z3r0boot/core/models").Message} Message */
/** @typedef {import("@z3r0boot/core/models").Conversation} Conversation */

/**
 * @param {Conversation} conversation
 * @param {object} options
 * @param {Message} options.message
 * @returns {string}
 */
export const buildConversationExcerpForAI = (conversation, { message }) =>
  `The following is an excerpt from a conversation between a human user and an AI assistent.

The conversation details are as follows:

- ID: ${conversation.id}
- Model: ${conversation.model}
- Created at: ${conversation.createdAt}

The AI assistent's response details are as follows:

- ID: ${message.id}
- Created at: ${message.createdAt}
- Content:

${message.content}`

/**
 * @param {Conversation} conversation
 * @param {object} options
 * @param {Message} options.message
 * @returns {string}
 */
export const buildConversationExcerpForHuman = (conversation, { message }) =>
  `The following is an excerpt from a conversation between a human user and an AI assistent.

The conversation details are as follows:

- ID: ${conversation.id}
- Model: ${conversation.model}
- Created at: ${conversation.createdAt}

The user's message/prompt details are as follows:

- ID: ${message.id}
- Created at: ${message.createdAt}
- Content:

${message.content}`
