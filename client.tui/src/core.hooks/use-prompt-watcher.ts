import { Stats, readFile } from "node:fs"

import { watch } from "chokidar"
import { useEffect } from "react"

export type UsePromptWatcher = (props: {
  onChange: (fileContent: string) => void
  onReady?: () => void
}) => void

export const usePromptWatcher: UsePromptWatcher = ({ onChange, onReady }) => {
  useEffect(() => {
    const watcher = watch(process.env["PROMPT_PATH"], {
      ignoreInitial: true,
    })

    watcher.on("ready", () => {
      onReady && onReady({ promptFilePath: process.env["PROMPT_PATH"] })
    })

    watcher.on("change", (path: string, stats: Stats) => {
      if (stats.size !== 0) {
        readFile(path, "utf8", (error, data) => {
          if (!error) {
            onChange(data)
          }
        })
      }
    })

    return () => {
      watcher.close()
    }
  }, [onChange])
}
