import { readFile } from "node:fs/promises"

/**
 * Read an ignore file and return it's rules. Following transformations are
 * applied:
 * - Remove comments and empty lines
 * - Remove trailing slashes
 * - Trim spaces
 * @param {string} path
 * @returns {Promise<string[]>}
 */
export const getIgnoreRules = async path =>
  readFile(path, "utf8").then(data =>
    data
      .split("\n")
      .filter(rule => {
        const isComment = rule.startsWith("#")
        const isEmpty = rule.trim() === ""

        return !isComment && !isEmpty
      })
      .map(rule => rule.trim().replace(/\/$/, ""))
  )
