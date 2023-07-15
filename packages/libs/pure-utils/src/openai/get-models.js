import { getOpenAIClient } from "./get-client.js"

/**
 * Get a list of available OpenAI models.
 * @returns {Promise<string[]>}
 */
export const getOpenAIModels = async () => {
  const openAIAPI = getOpenAIClient()
  const response = await openAIAPI.listModels()

  return response.data.data.map(item => item.id).sort()
}
