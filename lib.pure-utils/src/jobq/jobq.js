/** @typedef {import("./types.js").Job} Job */
/** @typedef {import("./to-job-with-lifecycle.js").JobWithLifecycle} JobWithLifecycle */

import EventEmitter from "node:events"
import os from "node:os"

import { toJobWithLifecycle } from "./to-job-with-lifecycle.js"

/**
 * @typedef {object} OnEventHandlerInput
 * @property {string} name
 * @property {[number, number]} duration
 * @property {Record<string, any>} context
 * @property {number} retries
 * @property {any} [result]
 * @property {any} [error]
 * @callback OnEventHandler
 * @param {OnEventHandlerInput} input
 * @returns {void}
 */

/**
 * @typedef {object} JobQueue
 * @property {(input: Job | Job[]) => void} push
 * @property {(input: {event: string, handler: OnEventHandler}) => void} on
 */

/**
 * @param {object} [options]
 * @param {number} [options.concurrency]
 * @param {number} [options.maxRetries]
 * @returns {JobQueue}
 */
export const buildJobQ = ({
  concurrency = os.cpus().length,
  maxRetries = 3,
} = {}) => {
  if (concurrency < 1) {
    throw new Error(
      '[buildJobQueue] "concurrency" option must be greater than 0'
    )
  }

  const waitingJobs = /** @type {JobWithLifecycle[]} */ ([])
  const runningJobs = /** @type {JobWithLifecycle[]} */ ([])
  const emitter = new EventEmitter()

  /**
   * Start any jobs that are waiting to be started, up to the concurrency limit
   * @returns {void}
   */
  const startNextJobs = () => {
    const isRunningQFull = runningJobs.length >= concurrency
    if (isRunningQFull) {
      return
    }

    const isRunningQEmpty = runningJobs.length === 0
    const isWaitingQEmpty = waitingJobs.length === 0
    if (isWaitingQEmpty && isRunningQEmpty) {
      emitter.emit("batch-finish")
      return
    }

    if (isWaitingQEmpty) {
      return
    }

    const nextJobs = waitingJobs.splice(0, concurrency - runningJobs.length)

    nextJobs.forEach(job => {
      runningJobs.push(job)
      job.work(job.context ?? {})
    })
  }

  /**
   * Remove a job matching the given id from the running queue
   * @param {string} id
   */
  const removeRunningJob = id => {
    const index = runningJobs.findIndex(job => job.id === id)

    if (index === -1) {
      return
    }

    runningJobs.splice(index, 1)
  }

  return {
    on: ({ event, handler }) => {
      emitter.on(event, handler)
    },
    push: input => {
      const jobs = Array.isArray(input) ? input : [input]

      jobs
        .map(job =>
          toJobWithLifecycle(job, {
            maxRetries,
            onFinish: ({ id, error, context, result, duration, retries }) => {
              removeRunningJob(id)

              if (error) {
                if (job.name) {
                  emitter.emit(`${job.name}-error`, {
                    duration,
                    context,
                    error,
                    retries,
                  })
                }

                emitter.emit("error", {
                  name: job.name,
                  context,
                  duration,
                  error,
                  retries,
                })

                return
              }

              if (job.name) {
                emitter.emit(`${job.name}-success`, {
                  context,
                  duration,
                  result,
                  retries,
                })
              }

              emitter.emit("success", {
                name: job.name,
                duration,
                context,
                result,
                retries,
              })

              startNextJobs()
            },
          })
        )
        .forEach(job => {
          waitingJobs.push(job)
        })

      startNextJobs()
    },
  }
}
