/**
 * @template {Record<string, unknown>} [T=Record<string, unknown>]
 * @param {Partial<T>} subset
 * @param {T} input
 * @returns {boolean}
 */
export const isMatch = (subset, input) =>
  Object.keys(subset).every(key => {
    return subset[key] === input[key]
  })
