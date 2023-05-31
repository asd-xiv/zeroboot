import { openaiAPI } from "../config.openai.js"

/**
 * Ask GPT-3.5 to summarize a text.
 * @param {string} input
 * @returns {Promise<string>}
 */
export const summarizeForSlugging = input =>
  openaiAPI
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: [
            "Create a maximum 10 word summary of the following text:",
            input.split("\n").map(line => `> ${line}`),
          ].join("\n"),
        },
      ],
      temperature: 0,
    })
    .then(response => {
      const summary = response.data.choices[0]?.message?.content

      if (!summary) {
        throw new Error("No summary was returned by OpenAI")
      }

      return summary
    })
