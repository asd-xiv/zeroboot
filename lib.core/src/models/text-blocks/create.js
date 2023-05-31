/** @typedef {import("./model.js").TextBlock} TextBlock */

import { randomUUID } from "node:crypto"
import { join } from "node:path"
import {
  computeHash,
  writeJSONToFile,
  getEnvironmentVariable,
} from "@z3r0boot/pure-utils"

import { openaiAPI } from "../../config.openai.js"
import { findOneTextBlockByPath } from "./find-one-by-path.js"

/**
 * Create an Embedding from a string using the `text-embedding-ada-002` model.
 * @param {object} input
 * @param {string} input.id
 * @param {string} input.content
 * @param {string} input.description
 * @param {string} [input.file]
 * @param {string} [input.fileCWD]
 * @param {string} input.type
 * @returns {Promise<TextBlock>}
 */
export const buildTextBlock = ({
  id,
  content,
  description,
  type,
  file,
  fileCWD,
}) =>
  openaiAPI
    .createEmbedding({
      model: "text-embedding-ada-002",
      input: content,
    })
    .then(response => ({
      id,
      content,
      description,
      type,
      file,
      fileCWD,
      hash: computeHash(content),
      tokens: response.data.usage.prompt_tokens,
      embeddingModel: response.data.model,
      embeddingData: response.data.data[0]?.embedding ?? [],
      createdAt: new Date().toISOString(),
    }))

/**
 * Create an Embedding from a string using the `text-embedding-ada-002` model
 * and persist it to the filesystem as a JSON file.
 * @param {object} input
 * @param {string} input.content
 * @param {string} input.description
 * @param {string} input.type
 * @param {string} [input.file]
 * @param {string} [input.fileCWD]
 * @returns {Promise<{status: "processed" | "cache-hit", item: TextBlock}>}
 */
export const createTextBlock = async ({
  content,
  description,
  type,
  file,
  fileCWD,
}) => {
  const id = randomUUID()
  const path = join(
    getEnvironmentVariable("ZB_DATABASE_HOME"),
    type,
    file ?? id
  )
  const previousTextBlock = await findOneTextBlockByPath(join(type, file ?? id))

  if (previousTextBlock?.hash === computeHash(content)) {
    return {
      status: "cache-hit",
      item: previousTextBlock,
    }
  }

  const textBlock = await buildTextBlock({
    id,
    content,
    description,
    type,
    file,
    fileCWD: fileCWD ?? process.cwd(),
  })
  await writeJSONToFile({ path }, textBlock)

  return {
    status: "processed",
    item: textBlock,
  }
}
