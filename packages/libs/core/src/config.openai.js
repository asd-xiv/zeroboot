import { getEnvironmentVariable } from "@z3r0boot/pure-utils"
import { OpenAIApi, Configuration } from "openai"

export const openaiAPI = new OpenAIApi(
  new Configuration({
    apiKey: getEnvironmentVariable("OPENAI_API_KEY"),
  })
)
