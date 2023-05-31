import test from "tape"

import { delay } from "../promise/delay.js"
import { buildJobQ } from "./jobq.js"

test("[buildJobQ] given a Job Queue with concurrency eq to 1 and a single job", async t => {
  // Given
  let jobRunCount = 0
  const jobQueue = buildJobQ({ concurrency: 1 })

  // When
  jobQueue.push({
    name: "single-run-job",
    work: async () => {
      jobRunCount += 1
    },
  })

  // Then
  t.plan(2)

  jobQueue.on({
    event: "single-run-job-success",
    handler: () => {
      t.equal(
        jobRunCount,
        1,
        "Job was run exactly once and specific success event was emmited"
      )
    },
  })

  jobQueue.on({
    event: "success",
    handler: ({ name }) => {
      t.deepEqual(
        { name, jobRunCount },
        { name: "single-run-job", jobRunCount: 1 },
        "Job was run exactly once and generic success event was emmited"
      )
    },
  })

  await delay(50)
})
