import { resolve } from "node:path"

import { readJSONFromFile } from "./read-json-from-file.js"

/**
 * @typedef {object} PackageJSON
 * @property {string} name
 * @property {string} description
 * @property {string} version
 */

/**
 * Get package data from package.json file.
 * @param {string} path
 * @returns {Promise<PackageJSON>}
 */
export const getPackageInfo = path =>
  /** @type {Promise<PackageJSON>} */ (readJSONFromFile(resolve(path)))
