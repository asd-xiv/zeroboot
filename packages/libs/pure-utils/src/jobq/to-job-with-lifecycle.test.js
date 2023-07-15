import test from "tape"

import { toJobWithLifecycle } from "./to-job-with-lifecycle.js"

test("[toJobWithLifecycle] given a successfull job", async t => {
  const job = /** @type {import("./types.js").Job<string>} */ ({
    name: "test",
    work: async () => "job result",
  })

  t.plan(3)

  const enhancedJob = toJobWithLifecycle(job, {
    onFinish: ({ id, duration, context, result, error, retries }) => {
      t.deepEquals(
        {
          id: typeof id,
          duration: `${typeof duration[0]}, ${typeof duration[1]}`,
          context,
          result,
          error: typeof error,
        },
        {
          id: "string",
          duration: "number, number",
          context: {},
          result: "job result",
          error: "undefined",
        },
        "should trigger onFinish with generated id, duration, empty context, result and no error"
      )
      t.equals(retries, 0, "should trigger onFinish with 0 retries")
    },
  })

  await enhancedJob.work()

  t.deepEquals(
    {
      id: typeof enhancedJob.id,
      name: enhancedJob.name,
      work: typeof enhancedJob.work,
    },
    {
      id: "string",
      name: "test",
      work: "function",
    },
    "should return a job with generated id, name and work function"
  )
})
