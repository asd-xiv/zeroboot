import { readFile, rm } from "node:fs/promises"
import { join } from "node:path"

import { summarize } from "@z3r0boot/core/agents"
import { createTextBlock, findOneTextBlockByPath } from "@z3r0boot/core/models"
import {
  buildJobQ,
  computeHash,
  formatHRTime,
  getAllFilePaths,
  getEnvironmentVariable,
  highlightFileName,
} from "@z3r0boot/pure-utils"
import chalk from "chalk"

/**
 * @param {string} folder
 * @param {object} options
 * @param {boolean} options.shouldBailOnFirstError
 * @param {boolean} options.shouldResetCache
 * @param {boolean} options.shouleGenerateSummaries
 * @param {string} options.ignoreFile
 * @param {(error: Error) => void} options.onBail
 * @returns {Promise<void>}
 */
export const generateEmbeddings = async (
  folder,
  {
    shouldResetCache,
    shouldBailOnFirstError,
    shouleGenerateSummaries,
    ignoreFile,
    onBail,
  }
) => {
  const startTime = process.hrtime()

  if (shouldResetCache) {
    await rm(getEnvironmentVariable("ZB_DATABASE_HOME") ?? "", {
      recursive: true,
      force: true,
    })
  }

  const jobQ = buildJobQ({ concurrency: 10, maxRetries: 3 })
  const files = await getAllFilePaths(folder, { ignoreFile })
  const filesStatus = /** @type {Record<string, any>} */ ({})

  /**
   * Generate embeddings for the contents of a file
   * @param {Record<string, any>} input
   * @returns {ReturnType<createTextBlock>}
   */
  const generateSourceEmbeddings = async ({ file }) => {
    const content = await readFile(file, "utf8")

    return createTextBlock({
      content,
      file,
      description: "File contents",
      type: "source",
    })
  }

  /**
   * Generate embeddings for the summary of a file
   * @param {Record<string, any>} input
   * @returns {ReturnType<createTextBlock>}
   */
  const generateSummaryEmbeddings = async ({ file }) => {
    const content = await readFile(file, "utf8")
    const hash = computeHash(content)
    const sourceTextBlock = await findOneTextBlockByPath(join("source", file))
    const summaryTextBlock = await findOneTextBlockByPath(join("summary", file))

    if (hash === sourceTextBlock?.hash && summaryTextBlock) {
      return {
        status: "cache-hit",
        item: summaryTextBlock,
      }
    }

    const summary = await summarize({
      content,
      path: file,
    })

    return createTextBlock({
      content: summary,
      description: "Summary of file content",
      file,
      type: "summary",
    })
  }

  files.forEach(file => {
    jobQ.push({
      name: "",
      context: { file },
      work: generateSourceEmbeddings,
    })

    if (shouleGenerateSummaries) {
      jobQ.push({
        name: "󰦩",
        context: { file },
        work: generateSummaryEmbeddings,
      })
    }
  })

  jobQ.on({
    event: "success",
    handler: ({ name, duration, context, result, retries }) => {
      const { file } = context
      const icon = chalk.green.bold("✓")
      let nameLabel = chalk.gray(name)
      let extra = chalk.gray(`cache-hit ${formatHRTime(duration)}`)

      if (result.status === "processed") {
        nameLabel = chalk.whiteBright(name)
        extra = `${chalk.yellow(formatHRTime(duration))} ${
          retries === 0 ? "" : chalk.red(retries)
        }`
      }

      filesStatus[file] = {
        ...filesStatus[file],
        [name]: result.status,
      }
      console.log(icon, nameLabel, highlightFileName(file), extra)
    },
  })

  jobQ.on({
    event: "error",
    handler: ({ name, context, error, retries }) => {
      const { file } = context
      const icon = chalk.red.bold("✗")
      const extra = `${chalk.red(error.message)} - ${chalk.gray(
        retries
      )} retries`

      console.log(icon, name, highlightFileName(file), extra)

      filesStatus[file] = {
        ...filesStatus[file],
        [name]: "error",
      }

      if (shouldBailOnFirstError) {
        onBail(error)
      }
    },
  })

  jobQ.on({
    event: "batch-finish",
    handler: () => {
      const filesWithErrorsCount = Object.entries(filesStatus).reduce(
        (acc, [, status]) => {
          if (status.source === "error" || status.summary === "error") {
            return acc + 1
          }
          return acc
        },
        0
      )

      console.log()
      ;[
        ["# input   ", folder],
        ["# output  ", getEnvironmentVariable("ZB_DATABASE_HOME")],
        ["# ignore  ", ignoreFile],
        ["# files   ", files.length],
        ["# errors  ", filesWithErrorsCount],
        ["# time    ", formatHRTime(process.hrtime(startTime))],
      ].forEach(([key, value]) => {
        console.log(chalk.gray(key), value)
      })
    },
  })
}
