import test from "tape"

import { toJobWithLifecycle } from "./to-job-with-lifecycle.js"

test("[toJobWithLifecycle] given a failing job with default maxRetries eq 3", async t => {
  const job = /** @type {import("./types.js").Job<string>} */ ({
    name: "test",
    context: { foo: "bar" },
    work: async () => {
      throw new Error("job error")
    },
  })

  t.plan(3)

  const enhancedJob = toJobWithLifecycle(job, {
    onFinish: ({ id, duration, context, result, error, retries }) => {
      t.deepEquals(
        {
          id: typeof id,
          duration: `${typeof duration[0]}, ${typeof duration[1]}`,
          context,
          result: typeof result,
          error: error?.message,
        },
        {
          id: "string",
          duration: "number, number",
          context: { foo: "bar" },
          result: "undefined",
          error: "job error",
        },
        "should trigger onFinish with generated id, duration, same context as passed from the job, error and no result"
      )
      t.equals(
        retries,
        4,
        "should trigger onFinish with 4 retries (initial + 3 retries)"
      )
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
