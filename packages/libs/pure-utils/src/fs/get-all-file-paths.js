import { existsSync } from "node:fs"
import { resolve } from "node:path"
import glob from "fast-glob"

import { getEnvironmentVariable } from "../env/get-environment-variable.js"
import { getIgnoreRules } from "../git/get-ignore-rules.js"

/**
 * Recursively get all file paths inside a folder. If an ignore file is passed,
 * it will be used to filter out files.
 * @param {string} folder
 * @param {object} [options]
 * @param {string} [options.ignoreFile]
 * @returns {Promise<string[]>}
 */
export const getAllFilePaths = async (folder, { ignoreFile } = {}) => {
  let ignoreRules = /** @type {string[]} */ ([])

  if (ignoreFile && existsSync(ignoreFile)) {
    ignoreRules = await getIgnoreRules(resolve(ignoreFile))
  }

  return glob(`${folder}/**/*`, {
    dot: true,
    ignore: [...ignoreRules, getEnvironmentVariable("ZB_HOME")],
  })
}
