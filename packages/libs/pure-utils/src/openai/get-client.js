import { OpenAIApi, Configuration } from "openai"
import { getEnvironmentVariable } from "../env/get-environment-variable.js"

/** @type {Record<string, OpenAIApi>} */
const STATE = {}

/**
 * Create an OpenAIApi client using the `OPENAI_API_KEY` environment variable.
 * Functions as a singleton with a cache of clients by name.
 * @param {string} [name]
 * @returns {OpenAIApi}
 */
export const getOpenAIClient = (name = "") => {
  if (!STATE[name]) {
    STATE[name] = new OpenAIApi(
      new Configuration({
        apiKey: getEnvironmentVariable("OPENAI_API_KEY"),
      })
    )
  }

  const client = STATE[name]

  if (!client) {
    throw new Error(`Failed to initialize OpenAIApi client for ${name}`)
  }

  return client
}
