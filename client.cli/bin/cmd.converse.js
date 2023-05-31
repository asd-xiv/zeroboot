/** @typedef {import("openai").ChatCompletionRequestMessage} ChatCompletionRequestMessage */

import {
  createConversation,
  findAllConversations,
  getOneConversation,
  findAllMessages,
} from "@z3r0boot/core/models"
import { getOpenAIClient, getOpenAIModels } from "@z3r0boot/pure-utils"
import inquirer from "inquirer"

/** @type {ChatCompletionRequestMessage[]} */
const MESSAGES = []

const OPENAI_CLIENT = getOpenAIClient("converse-client")

/**
 * @param {object} options
 * @param {string} options.model
 * @returns {Promise<void>}
 */
const askUser = async ({ model }) => {
  const { message } = await inquirer.prompt({
    type: "input",
    name: "message",
    message: "You: ",
  })

  MESSAGES.push({
    role: "user",
    content: message,
  })

  const response = await OPENAI_CLIENT.createChatCompletion({
    model,
    messages: MESSAGES,
  })

  MESSAGES.push({
    role: "assistant",
    content: response.data.choices[0].message.content,
  })

  console.log(`AI: ${response.data.choices[0].message.content}`)

  askUser({ model })
}

export const converse = async () => {
  const conversationIds = [
    "Start a new conversation",
    ...(await findAllConversations()).map(item => item.id),
  ]

  const { conversationId } = await inquirer.prompt({
    type: "list",
    name: "conversationId",
    message: "Continue a previous conversation:",
    choices: conversationIds,
    default: "Start a new conversation",
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

  const messages = findAllMessages({
    where: { conversationId: conversation.id },
  })

  MESSAGES.push({
    role: "system",
    content: `You are talking to OpenAI's ${model}.`,
  })

  askUser({ model })
}
