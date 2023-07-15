import path from "node:path"
import {
  getEnvironmentVariable,
  readJSONFromFileSync,
  writeJSONToFile,
} from "@z3r0boot/pure-utils"
import { useState, useEffect, useCallback, Dispatch } from "react"

export type UsePersistentState = <T extends Record<string, any>>(
  id: string,
  defaults: T
) => [T, Dispatch<Partial<T>>]

export const usePersistentState: UsePersistentState = (id, defaults) => {
  const filePath = path.join(
    getEnvironmentVariable("ZB_STATE_HOME"),
    `${id}.json`
  )
  const [data, setData] = useState<typeof defaults>(() => {
    try {
      return {
        ...defaults,
        ...readJSONFromFileSync(filePath),
      }
    } catch (error) {
      const expectedError = error as NodeJS.ErrnoException

      // Ignore "file not exist" errors, will be created on first write
      if (expectedError.code !== "ENOENT") {
        console.error(
          `Failed to initialize data from local file: ${expectedError.message}`
        )
      }

      return defaults
    }
  })

  useEffect(() => {
    writeJSONToFile({ path: filePath }, data).catch(error => {
      console.error(`Failed to save data to local file: ${error.message}`)
    })
  }, [filePath, data])

  const handleMergeData = useCallback<Dispatch<Partial<typeof defaults>>>(
    newData => {
      setData(previousData => ({
        ...previousData,
        ...newData,
      }))
    },
    []
  )

  return [data, handleMergeData]
}
