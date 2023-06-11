import { Stats, readFile } from "node:fs"

import { watch } from "chokidar"
import { useEffect } from "react"

export type UseFileWatcher = (props: {
  path: string
  onChange: (content: string) => void
  onReady?: (path: string) => void
}) => void

export const useFileWatcher: UseFileWatcher = ({ path, onChange, onReady }) => {
  useEffect(() => {
    const watcher = watch(path, {
      ignoreInitial: true,
    })

    watcher.on("ready", () => {
      if (onReady) {
        onReady(path)
      }
    })

    watcher.on("change", (changedPath: string, stats: Stats) => {
      if (stats.size !== 0) {
        readFile(changedPath, "utf8", (error, data) => {
          if (!error) {
            onChange(data)
          }
        })
      }
    })

    return () => {
      watcher.close()
    }
  }, [path, onChange, onReady])
}
