/* eslint-disable promise/avoid-new */

import { join } from "node:path"
import { exec } from "node:child_process"

import chalk from "chalk"
const { cyan } = chalk

import { CONFIG, SPINNER } from "../config.js"

/**
 *
 * @param {string} repoPath
 * @param {Object} props
 * @param {string} props.localPath
 *
 * @returns {Promise<void>}
 */
export const clone = (repoPath, { localPath }) =>
  new Promise((resolve, reject) => {
    exec(
      `git clone https://github.com/${repoPath} ${join(localPath, repoPath)}`,
      error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      }
    )
  })

/**
 *
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
export const pull = path =>
  new Promise((resolve, reject) => {
    exec(`cd ${path} && git pull`, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })

/**
 *
 * @param {string} path
 *
 * @returns {Promise<boolean>}
 */
export const checkIsGitRepo = path =>
  new Promise(resolve => {
    exec(`cd ${path} && git status`, error => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })

/**
 *
 * @param {string} repoPath
 * @param {Object} props
 * @param {string} props.localPath
 *
 * @returns {Promise<void>}
 */
export const cloneOrPull = (repoPath, { localPath }) => {
  const repoLocalPath = join(localPath, repoPath)

  return checkIsGitRepo(repoLocalPath)
    .then(isRepo => {
      SPINNER.start(
        `${isRepo ? "Pulling" : "Cloning"} git repo: ${cyan(repoPath)}`
      )

      if (isRepo) {
        return pull(repoLocalPath)
      }

      return clone(repoPath, { localPath })
    })
    .then(() => {
      SPINNER.succeed()
    })
}

/**
 * @param {string[]} input
 *
 * @returns {Promise<void[]>}
 */
export const cloneOrPullMany = input =>
  Promise.all(
    input.map(repoPath =>
      cloneOrPull(repoPath, {
        localPath: CONFIG.CACHE_PATH,
      })
    )
  )
