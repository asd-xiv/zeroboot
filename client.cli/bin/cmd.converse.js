/** @typedef {import("openai").ChatCompletionRequestMessage} ChatCompletionRequestMessage */
/** @typedef {import("@z3r0boot/core/models").Message} Message */
/** @typedef {import("@z3r0boot/core/models").Conversation} Conversation */

import {
  createConversation,
  findAllConversations,
  getOneConversation,
  findAllMessages,
  createMessage,
  createTextBlock,
} from "@z3r0boot/core/models"
import { getOpenAIClient, getOpenAIModels } from "@z3r0boot/pure-utils"
import chalk from "chalk"
import inquirer from "inquirer"

const MESSAGES = /** @type {Message[]} */ ([])
const OPENAI_CLIENT = getOpenAIClient("converse-client")

/**
 * @param {Message} input
 */
const echoMessage = async input => {
  const actor = "And"

  console.log(`${chalk.bold(actor)}: ${input.content}`)
  console.log()
}

/**
 * @param {object} options
 * @param {Conversation} options.conversation
 * @returns {Promise<Message>}
 */
const askUser = async ({ conversation }) => {
  const { question } = await inquirer.prompt({
    type: "input",
    name: "question",
    message: "You: ",
  })

  const message = await createMessage({
    conversationId: conversation.id,
    content: question,
    role: "user",
  })

  await createTextBlock({
    content: message.content,
    type: "conversation-excerpt",
    description: "User prompt",
    meta: {
      conversationId: conversation.id,
    },
  })

  MESSAGES.push(message)

  return message
}

/**
 * @param {object} options
 * @param {Conversation} options.conversation
 * @param {Message[]} options.messages
 * @returns {Promise<Message>}
 */
const askAssistent = async ({ conversation, messages }) => {
  const aiResponse = await OPENAI_CLIENT.createChatCompletion({
    model: conversation.model,
    messages,
  })

  if (!aiResponse.data.choices[0]?.message) {
    throw new Error("No response from AI assistent")
  }

  const userMessage = messages.findLast(item => item.role === "user")

  if (!userMessage) {
    throw new Error("No user message found")
  }

  const aiMessage = await createMessage({
    conversationId: conversation.id,
    content: aiResponse.data.choices[0].message.content,
    role: "assistant",
  })

  await createTextBlock({
    content: aiMessage.content,
    type: "conversation-excerpt",
    description: "AI's response",
    meta: {
      conversationId: conversation.id,
    },
  })

  MESSAGES.push(aiMessage)

  return aiMessage
}

/**
 * @param {Conversation} conversation
 * @returns {Promise<void>}
 */
const restartConversation = async conversation => {
  const messages = await findAllMessages({
    where: {
      conversationId: conversation.id,
    },
  })

  messages.forEach(message => echoMessage(message))
}

/**
 * @returns {Promise<void>}
 */
export const converse = async () => {
  const conversations = await findAllConversations()
  const conversationIds = [
    "New conversation",
    ...conversations.map(item => item.id),
  ]

  const { conversationId } = await inquirer.prompt({
    type: "list",
    name: "conversationId",
    message: "Continue conversation:",
    choices: conversationIds,
    default: "New conversation",
  })

  const { model } = await inquirer.prompt({
    type: "list",
    name: "model",
    message: "Choose an AI model:",
    choices: await getOpenAIModels(),
    default: "gpt-3.5-turbo",
  })

  const conversation =
    conversationId === "Start a new conversation"
      ? await createConversation({ model })
      : await getOneConversation(conversationId)

  restartConversation(conversation)
}
