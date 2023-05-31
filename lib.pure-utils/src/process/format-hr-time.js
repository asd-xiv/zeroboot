/**
 * Format hrtime to human readable format.
 * @param {[number, number]} input
 * @returns {string}
 * @example
 * formatHRTime(process.hrtime())
 * // => 123ms
 * formatHRTime(process.hrtime())
 * // => 1.234s
 */
export const formatHRTime = input => {
  const [seconds, nanoseconds] = input
  const milliseconds = Math.round(nanoseconds / 1e6)

  if (seconds >= 1) {
    return `${seconds}.${milliseconds}s`
  }

  return `${milliseconds}ms`
}
