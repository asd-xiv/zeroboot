import test from "tape"

import { delay } from "../promise/delay.js"
import { buildJobQ } from "./jobq.js"

test("[buildJobQ] given a Job Queue with concurrency eq to 2 and multiple jobs", async t => {
  // Given
  let runningJobs = 0
  let maxRunningJobs = 0
  const concurrency = 2

  const jobQueue = buildJobQ({ concurrency })
  const jobWork = async () => {
    runningJobs += 1
    maxRunningJobs = Math.max(maxRunningJobs, runningJobs)

    // Simulate job taking some time to complete
    await delay(25)

    runningJobs -= 1
  }

  // When
  for (let index = 0; index < 5; index += 1) {
    jobQueue.push({
      name: `concurrent-job-${index}`,
      work: jobWork,
    })
  }

  // Then
  t.plan(1)

  jobQueue.on({
    event: "batch-finish",
    handler: () => {
      t.equal(maxRunningJobs, concurrency, "Concurrency level was respected")
    },
  })

  // Wait for all job batches to finish, plus a little extra time to make sure
  await delay(3 * 25 + 10)
})
