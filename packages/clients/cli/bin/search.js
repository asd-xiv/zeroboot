#!/usr/bin/env node

import { computeHash } from "@z3r0boot/pure-utils"
import chalk from "chalk"
import { program } from "commander"
import glob from "fast-glob"

import { formatHRTime } from "../src/libs/process/format-hr-time.js"
import { cosineSimilarity } from "../src/libs/similarity/cosine.js"
import { highlightFileName } from "../src/libs/string/highlight-file-name.js"
import { getEnvironmentVariable } from "../src/load-environment-variables.js"
import {
  createEmbedding,
  findManyEmbeddings,
  getOneEmbeddingWithPath,
} from "../src/models/embeddings/index.js"

program.argument("query", "Query string").action(async query => {
  const startTime = process.hrtime()
  const slug = computeHash(query)
  const path = `${slug}.json`

  const { item: queryEmbeddings } = await createEmbedding(
    { content: query },
    { sourcePath: path }
  )

  console.log(
    chalk.green.bold("✓"),
    highlightFileName(path),
    chalk.yellow(formatHRTime(process.hrtime(startTime)))
  )

  const embeddings = await findManyEmbeddings()

  const similarities = await Promise.all(
    files.map(async file => {
      const sourceEmbedding = await getOneEmbeddingWithPath(file)
      const similarity = cosineSimilarity(
        queryEmbeddings.embedding,
        sourceEmbedding.embedding
      )

      return {
        path: file,
        similarity,
      }
    })
  )

  similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10)
    .forEach(similarity => {
      console.log(`${similarity.similarity.toFixed(3)} ${similarity.path}`)
    })
})

program.parse(process.argv)
