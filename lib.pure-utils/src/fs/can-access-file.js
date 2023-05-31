import { constants } from "node:fs"
import { access } from "node:fs/promises"

/**
 * Predicate to check if a file can be read.
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export const canReadFile = async path => {
  try {
    await access(path, constants.R_OK)
    return true
  } catch {
    return false
  }
}
