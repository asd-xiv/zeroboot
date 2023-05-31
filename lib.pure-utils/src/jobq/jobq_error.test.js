import test from "tape"

import { delay } from "../promise/delay.js"
import { buildJobQ } from "./jobq.js"

test("[buildJobQ] given a failing job with concurrency eq 1 and maxRetries eq 2", async t => {
  // Given
  let jobRunCount = 0
  const jobQueue = buildJobQ({ concurrency: 1, maxRetries: 2 })

  // When
  jobQueue.push({
    name: "error-job",
    work: async () => {
      jobRunCount += 1
      throw new Error("Job failed")
    },
  })

  // Then
  t.plan(3)

  jobQueue.on({
    event: "error-job-error",
    handler: ({ error }) => {
      t.equal(
        jobRunCount,
        3,
        "Job was run a total of 3 times (the initial run and 2 retries)"
      )
      t.equal(
        error.message,
        "Job failed",
        "Job error was thrown and specific error event was emmited"
      )
    },
  })

  jobQueue.on({
    event: "error",
    handler: ({ name, error }) => {
      t.deepEqual(
        { name, jobRunCount, error: error.message },
        { name: "error-job", jobRunCount: 3, error: "Job failed" },
        "Job error was thrown and generic error event was emmited"
      )
    },
  })

  // Wait for job to fail and events to be emitted
  await delay(25)
})
