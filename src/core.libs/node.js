/**
 * @typedef {import("../index.js").PackageJSON} PackageJSON
 */

import { access, readdir, readFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import toml from "@ltd/j-toml"

const __dirname = new URL(import.meta.url).pathname

/**
 * Check if a path is a directory and is does not contain any files or
 * other directories.
 *
 * @param {string} path
 *
 * @returns {Promise<boolean>}
 */
export const checkIfDirectoryIsEmpty = path =>
  readdir(path)
    .then(files => {
      if (files.length !== 0) {
        throw new Error("Directory is not empty")
      }

      return true
    })
    .catch(error => {
      if (error.code === "ENOTDIR") {
        throw new Error("Path is not a directory")
      }

      throw error
    })

/**
 * Check if a path is a directory.
 *
 * @param {string} path
 *
 * @returns {Promise<boolean>}
 */
export const checkIfDirectoryExists = path =>
  access(path)
    .then(() => true)
    .catch(() => false)

/**
 * Get Node.js full version as an array of numbers.
 *
 * @returns {[number, number, number]}
 */
export const getNodeVersion = () => {
  const { node } = process.versions

  return /** @type {[number, number, number]} */ (
    node.split(".").map(Number.parseInt)
  )
}

/**
 * Read a file and parse it as TOML.
 *
 * @param {string} path
 *
 * @returns {Promise<Record<string, unknown>>}
 */
export const readFileAsTOML = path =>
  readFile(path, "utf8").then(buffer => toml.parse(buffer.toString()))

/**
 * Read a file and parse it as JSON.
 *
 * @param {string} path
 *
 * @returns {Promise<Record<string, unknown>>}
 */
export const readFileAsJSON = path =>
  readFile(path, "utf8").then(buffer => JSON.parse(buffer.toString()))

/**
 * Get Zeroboot package info from package.json file.
 *
 * @returns {Promise<PackageJSON>}
 */
export const getPackageInfo = () => {
  const path = join(__dirname, "..", "..", "..", "package.json")

  return /** @type {Promise<PackageJSON>} */ (readFileAsJSON(resolve(path)))
}
