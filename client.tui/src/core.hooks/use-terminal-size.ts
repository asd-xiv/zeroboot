import { useStdout } from "ink"
import { useEffect, useState } from "react"

export type UseTerminalSize = () => [number, number]

/**
 * Returns the current terminal size.
 *
 * @example
 * const [width, height] = useTerminalSize()
 * console.log(`Terminal size is ${width}x${height}`)
 */
export const useTerminalSize: UseTerminalSize = () => {
  const { stdout } = useStdout()
  const [size, setSize] = useState<[number, number]>([
    stdout.columns,
    stdout.rows,
  ])

  useEffect(() => {
    const handler = () => setSize([stdout.columns, stdout.rows])

    stdout.on("resize", handler)

    return () => {
      stdout.off("resize", handler)
    }
  }, [stdout])

  return size
}
