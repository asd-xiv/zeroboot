/**
 * Slugify a string
 * @param {string} input
 * @returns {string}
 * @example
 * slugify(".Hello   World-")
 * // => "hello-world"
 */
export const slugify = input =>
  input
    .trim()
    .toLowerCase()
    // remove leading and trailing non-word characters
    .replaceAll(/^\W|\W$/g, "")
    // replace multiple spaces with a single space
    .replaceAll(/\s+/g, " ")
    // replace non-word characters with a dash
    .replaceAll(/\W/g, "-")
