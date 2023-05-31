import { openaiAPI } from "../config.openai.js"

/**
 * Ask GPT-3.5 to summarize a text. The text is meant to be used as metadata for
 * an embedding.
 * @param {object} input
 * @param {string} input.path
 * @param {string} input.content
 * @param {string} [input.model]
 * @returns {Promise<string>}
 */
export const summarize = ({ path, content, model = "gpt-3.5-turbo" }) =>
  openaiAPI
    .createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content: [
            "You are an intelligent AI assistant. Your task is to summarize the content of code files concisely and accurately. These summaries will be used as metadata for file embeddings to improve the precision of future search queries.",
            "",
            " - Consider the file path and its location to understand the context of the file, but do not include the file path in the summary itself.",
            " - Avoid using phrases like 'Sure thing, here is the summary for file located in ...' or 'The summary is:', just output the summary itself.",
            " - Use active voice, say 'Remove orphan packages', not 'Removing orphan packages'. Or, more generally, use the short infinitive form, not gerund.",
            " - If the file is a code file, include in the overall summary a list of functions, classes or any important unit, with a summary for each of them.",
            "",
            "Here's an example of a good summary.",
            "",
            "For the following file:",
            "> {",
            '>  "root": true,',
            '>  "extends": ["airbnb", "prettier"],',
            '>  "plugins": ["prettier"],',
            '>  "rules": {',
            '>    "prettier/prettier": "error"',
            ">  }",
            ">}",
            "",
            "The summary should be something like:",
            "> ESLint configuration for Node.js projects.",
            "> - Extends the Airbnb configuration",
            "> - Uses Prettier plugin and configuration",
            "> - Uses TypeScript parser",
          ].join("\n"),
        },
        {
          role: "user",
          content: ["File path:\n", path, "", "File content:\n", content].join(
            "\n"
          ),
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
