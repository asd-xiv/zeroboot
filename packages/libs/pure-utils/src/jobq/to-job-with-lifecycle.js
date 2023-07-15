import { randomUUID } from "node:crypto"

/**
 * @template [T=any]
 * @typedef {object} JobWithLifecycle
 * @property {string} id
 * @property {string} [name]
 * @property {Record<string, any>} context
 * @property {(context?: Record<string, any>) => Promise<T>} work
 */

/**
 * @typedef {object} OnFinishHandlerInput
 * @property {string} id
 * @property {[number, number]} duration
 * @property {Record<string, any>} context
 * @property {number} retries
 * @property {any} [result]
 * @property {any} [error]
 * @callback OnFinishHandler
 * @param {OnFinishHandlerInput} input
 * @returns {void}
 */

/**
 * Wrap a Job's ".work" function in a Promise and emit events on success
 * and error
 * @template T
 * @param {import("./types.js").Job<T>} job
 * @param {object} options
 * @param {OnFinishHandler} options.onFinish
 * @param {number} [options.maxRetries]
 * @returns {JobWithLifecycle<T>}
 */
export const toJobWithLifecycle = (job, { maxRetries = 3, onFinish }) => {
  const enhancedJob = /** @type {JobWithLifecycle} */ ({
    ...job,
    id: randomUUID(),
  })
  let retries = 0

  enhancedJob.work = async () => {
    const { id } = enhancedJob
    const context = job.context ?? {}
    const startTime = process.hrtime()

    while (retries <= maxRetries) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await job.work(context)

        onFinish({
          id,
          duration: process.hrtime(startTime),
          context,
          result,
          retries,
        })

        // force loop exit, otherwise infinite loop
        return
      } catch (error) {
        retries += 1

        if (retries > maxRetries) {
          onFinish({
            id,
            duration: process.hrtime(startTime),
            context,
            error,
            retries,
          })
        }
      }
    }
  }

  return enhancedJob
}
