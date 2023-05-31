import EventEmitter from "node:events"
import { readFile } from "node:fs/promises"

import { getAllFilePaths, runJobsInBatches } from "@z3r0boot/core/libs"
import { createEmbedding } from "@z3r0boot/core/models"

/**
 * @typedef {object} FileSuccessResult
 * @property {string} path
 * @property {string} [icon]
 * @property {[number, number]} duration
 * @property {"processed" | "cache-hit"} status
 * @typedef {object} FileSuccessHandler
 * @property {"file-success"} event
 * @property {(result: FileSuccessResult) => void} handler
 */

/**
 * @typedef {object} FileErrorResult
 * @property {string} path
 * @property {string} [icon]
 * @property {[number, number]} duration
 * @property {"error"} status
 * @property {Error} error
 * @typedef {object} FileErrorHandler
 * @property {"file-error"} event
 * @property {(result: FileErrorResult) => void} handler
 */

/**
 * @typedef {object} FolderFinishResult
 * @property {FileSuccessResult[]} successPaths
 * @property {FileErrorResult[]} errorPaths
 * @property {[number, number]} duration
 * @typedef {object} FolderFinishHandler
 * @property {"finish"} event
 * @property {(result: FolderFinishResult) => void} handler
 */

/**
 * Recursively generates embeddings for all files inside a folder. An ignore
 * file can be passed. Can optionally create an summary for each file, together
 * with it's embedding.
 * @param {object} options
 * @param {string} options.folder
 * @param {string} [options.ignoreFile]
 * @returns {{ on: (input: FileSuccessHandler | FileErrorHandler | FolderFinishHandler) => void }}
 */
export const buildEmbeddingsEmitter = ({ folder, ignoreFile }) => {
  const folderStartTime = process.hrtime()
  const eventEmitter = new EventEmitter()
  const resultsSucceed = /** @type {FolderFinishResult["successPaths"]}  */ ([])
  const resultsError = /** @type {FolderFinishResult["errorPaths"]}  */ ([])

  getAllFilePaths(folder, {
    ignoreFile,
  }).then(files => {
    const embeddingJobs = files
      .reduce((acc, file) => {
        acc.push({
          file: `${file}.embedding.json`,
          meta: {
            cwd: process.cwd(),
            file,
          },
        })

        return acc
      }, /** @type {{file: string, meta: Record<string, any>}[]} */ ([]))
      .map(({ file, meta }) => {
        const fileStartTime = process.hrtime()
        const sourceFile = meta.file

        return {
          run: () =>
            readFile(sourceFile, "utf8").then(content =>
              createEmbedding({ content, meta }, { path: file })
                .then(({ status }) => {
                  const fileResult = /** @type {const} */ ({
                    path: sourceFile,
                    duration: process.hrtime(fileStartTime),
                    status,
                  })

                  resultsSucceed.push(fileResult)
                  eventEmitter.emit("file-success", fileResult)
                })
                .catch(error => {
                  const expectedError = /** @type {Error} */ (error)
                  const fileResult = /** @type {const} */ ({
                    path: sourceFile,
                    duration: process.hrtime(fileStartTime),
                    status: "error",
                    error: expectedError,
                  })

                  resultsError.push(fileResult)
                  eventEmitter.emit("file-error", fileResult)
                })
            ),
        }
      })

    runJobsInBatches({ batchSize: 10 }, embeddingJobs).then(() => {
      eventEmitter.emit("finish", {
        successPaths: resultsSucceed,
        errorPaths: resultsError,
        duration: process.hrtime(folderStartTime),
      })
    })
  })

  return {
    on: ({ event, handler }) => {
      if (
        event !== "finish" &&
        event !== "file-success" &&
        event !== "file-error"
      ) {
        throw new Error(`Unknown event: ${event}`)
      }

      eventEmitter.on(event, handler)
    },
  }
}

// const metaJobs = files.map(file => ({
//   run: async () => {
//     const embeddingStartTime = process.hrtime()
//     const embeddingPath = resolve(output, "meta", `${file}.json`)
//     const sourceContent = await readFile(file, "utf8")
//     const previousEmbedding = await findEmbeddingsFile(embeddingPath)

//     if (previousEmbedding?.meta?.fileHash === computeHash(sourceContent)) {
//       echoFileStatus(embeddingPath, {
//         status: "cache-hit",
//         processStartTime: embeddingStartTime,
//       })

//       return { status: "cache-hit" }
//     }

//     const summary = await sumarizeForEmbeddingMetadata({
//       path: resolve(output, "source", `${file}.json`),
//       content: await readFile(file, "utf8"),
//     })
//     const embedding = await writeEmbeddingFile(embeddingPath, {
//       content: summary,
//       description: "Embedding of code summary in 'meta.filePath'",
//       meta: {
//         filePath: resolve(file),
//         fileHash: computeHash(sourceContent),
//       },
//     })

//     echoFileStatus(embeddingPath, {
//       status: embedding.status,
//       error: embedding.error,
//       processStartTime: embeddingStartTime,
//     })

//     return embedding
//   },
// }))

// if (summaryModel) {
//   summaryJobs = files.map(file => {
//     const summaryFileName = `summary_${basename(file)}`
//     const summaryFile = join(dirname(file), summaryFileName)

//     return {
//       run: async () => {
//         const startTime = process.hrtime()
//         const content = await readFile(file, "utf8")

//         return createEmbedding(
//           {
//             content: await summarizeForEmbeddingMetadata({
//               path: file,
//               content,
//             }),
//             meta: {
//               isSummary: true,
//               forSourceFile: file,
//             },
//           },
//           {
//             path: summaryFile,
//           }
//         )
//           .then(({ status }) => {
//             const fileResult = /** @type {const} */ ({
//               path: summaryFile,
//               duration: process.hrtime(startTime),
//               status,
//             })

//             resultsSucceed.push(fileResult)
//             eventEmitter.emit("file-success", fileResult)
//           })
//           .catch(error => {
//             const expectedError = /** @type {Error} */ (error)
//             const fileResult = /** @type {const} */ ({
//               path: summaryFile,
//               duration: process.hrtime(startTime),
//               status: "error",
//               error: expectedError,
//             })

//             resultsError.push(fileResult)
//             eventEmitter.emit("file-error", fileResult)
//           })
//       },
//     }
//   })
// }
