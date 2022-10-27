import path from "node:path"
import ora from "ora"
import { isNil, mergeDeepRight } from "rambda"

import chalk from "chalk"
const { cyan } = chalk

import { readFileAsTOML } from "./core.libs/node.js"

if (isNil(process.env["HOME"])) {
  throw new Error("$HOME environment variable is not set")
}

const USER_CONFIG_PATH = path.join(
  process.env["XDG_CONFIG_HOME"] ?? path.join(process.env["HOME"], ".config"),
  "zeroboot.toml"
)

export const SPINNER = ora()

/**
 * @typedef {Object} Config
 *
 * @property {boolean}  DEBUG
 * @property {string}   CACHE_PATH
 * @property {string}   LOCAL_PATH
 * @property {string[]} GIT_REPO_URLS
 */

/** @type {Required<Config>} */
const defaultConfig = {
  DEBUG: false,

  CACHE_PATH: path.join(
    process.env["XDG_CACHE_HOME"] ?? path.join(process.env["HOME"], ".cache"),
    "zeroboot"
  ),

  LOCAL_PATH: path.join(process.env["HOME"], "Zeroboot"),

  GIT_REPO_URLS: ["asd-xiv/zeroboot-stacks"],
}

/** @type {Config} */
export const CONFIG = mergeDeepRight(
  defaultConfig,
  await readFileAsTOML(USER_CONFIG_PATH)
    .then(data => {
      SPINNER.info(`Loaded config from ${cyan(USER_CONFIG_PATH)}`)

      return data
    })
    .catch(error => {
      if (error.code === "ENOENT") {
        SPINNER.info(
          `User config file ${cyan(
            USER_CONFIG_PATH
          )} does not exist, using defaults`
        )

        return {}
      }

      throw error
    })
)
