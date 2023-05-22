/** @typedef { import("../core.types/stack.js").Stack } Stack */
/** @typedef { import("../core.types/deck.js").Deck } Deck */

import nUtil from "node:util"
import nFs from "node:fs/promises"
import nPath from "node:path"

import ejs from "ejs"
import inquirer from "inquirer"
import glob from "glob"
import { pipe, map, join, groupBy, evolve, add } from "rambda"

import { CONFIG } from "../config.js"
import { cloneOrPullMany } from "../core.libs/git.js"
import { readFileAsJSON } from "../core.libs/node.js"

const globP = nUtil.promisify(glob)
const __dirname = new URL("../", import.meta.url).pathname

/**
 * @typedef {Object} DeckConfig
 *
 * @property {string} repoAddress
 * @property {string} localPath
 * @property {Deck}   rc
 */

/**
 * Read and parse a deck's ".zerobootrc" config file.
 *
 * @param {[string, string]} repoAddressLocalPathTuple
 * @returns {Promise<DeckConfig>}
 */
const getDeckConfig = ([repoAddress, localPath]) =>
  // TODO: add json schema validation
  readFileAsJSON(nPath.join(localPath, ".zerobootrc")).then(config => ({
    repoAddress,
    localPath,
    rc: /** @type {Deck} */ (config),
  }))

/**
 * Read and parse multiple decks' config file.
 *
 * @param {[string, string][]} decks
 * @returns {Promise<DeckConfig[]>}
 */
const getAllDecksConfigs = decks => Promise.all(map(getDeckConfig, decks))

/**
 * @typedef {Object} DeckContents
 *
 * @property {string[]} chunks
 * @property {string[]} stacks
 */

evolve({
  foo: (...asd) => console.log(asd),
  bar: input => add(-1, input),
})({
  a: 1,
  foo: 2,
  bar: 3,
})
// => `result` is equal to `expected`

/**
 *
 * @param {DeckConfig} config
 *
 * @returns {Promise<DeckContents>}
 */
const getDeckContents = config => {
  console.log(config)

  globP(`${CONFIG.CACHE_PATH}/*/stack.*`).then(
    pipe(
      map(filePath => import(filePath).then(template => template.default)),
      fileTuples => Promise.all(fileTuples)
    )
  )
}

/**
 *
 * @param {[string, Deck][]} configs
 *
 * @returns {Promise<DeckContents[]>}
 */
const getAllDecksContents = configs =>
  Promise.all(map(getDeckContents, configs))

/**
 *
 * @param {Stack[]} input
 *
 * @returns {Promise<Stack>}
 */
const pickStack = input => {
  if (input.length === 0) {
    throw new Error(`No stacks found locally or in remote repositories.`)
  }

  return inquirer
    .prompt([
      {
        name: "stack",
        type: "rawlist",
        message: "Select stack",
        choices: map(item => ({ value: item, name: item.name }), input),
      },
    ])
    .then(({ stack }) => {
      console.log(stack)

      return stack
    })
}

/**
 *
 * @param {Stack} stack
 *
 * @returns {Promise<string[]>}
 */
const pluckChunks = stack =>
  inquirer
    .prompt([
      {
        name: "chunks",
        type: "checkbox",
        message: "Select chunks",
        suffix: ` (${join(", ", stack.chunks.required)})`,
        choices: stack.chunks.optional,
      },
    ])
    .then(({ chunks }) => [...stack.chunks.required, ...chunks])

/**
 *
 * @param {string[]} chunks
 *
 * @returns {{
 *   chunks: string[],
 *   filesByChunk: Record<string, string[]>
 * }}
 */
const getFilesByChunk = chunks => {
  const filesByChunk = pipe(
    join("|"),
    chunksPattern => `${__dirname}/src/chunk.?(${chunksPattern})/content/**/*`,
    filesPattern => glob.sync(filesPattern, { dot: true, nodir: true }),
    groupBy(file => chunks.find(chunk => file.includes(chunk)) ?? "")
  )(chunks)

  return {
    chunks,
    filesByChunk,
  }
}

/**
 *
 * @param {string } filePath
 * @param {Object}  props
 * @param {string}  props.destinationPath
 *
 * @returns {Promise<void>}
 */
const renderFile = (filePath, { destinationPath }) =>
  nFs
    .mkdir(destinationPath, { recursive: true })
    .then(() => ejs.renderFile(filePath, {}, {}))
    .then(compiledContent => nFs.writeFile(destinationPath, compiledContent))

/**
 *
 * @param {string[]} files
 * @param {Object}   props
 * @param {string}   props.destinationPath
 *
 * @returns {Promise<void[]>}
 */
const renderFiles = (files, { destinationPath }) => {
  const filesPromises = files.map(file =>
    renderFile(file, {
      destinationPath: path.join(destinationPath, path.basename(file)),
    })
  )

  return Promise.all(filesPromises)
}

/**
 *
 * @param {Object}                   props
 * @param {string}                   props.destinationPath
 * @param {string[]}                 props.chunks
 * @param {Record<string, string[]>} props.filesByChunk
 *
 * @returns {Promise<void>}
 */
const renderStack = ({ destinationPath, chunks, filesByChunk }) =>
  nFs
    .mkdir(destinationPath, { recursive: true })
    .then(() => {
      const chunksPromises = chunks.map(item =>
        renderFiles(filesByChunk[item] ?? [], { destinationPath })
      )

      return Promise.all(chunksPromises)
    })
    .then(() => {})

/**
 * Find all files from selected chunks and render them to a destination folder.
 *
 * @param {Object} props
 * @param {string} props.destinationPath
 *
 * @returns {Promise<void>}
 */
export const build = ({ destinationPath }) =>
  cloneOrPullMany(CONFIG.GIT_REPO_URLS)
    .then(getAllDecksConfigs)
    .then(
      map(
        evolve({
          stacks: () => {},
          chunks: () => {},
        })
      )
    )
    .then(getAllDecksContents)
    .then(pickStack)
    .then(pluckChunks)
    .then(getFilesByChunk)
    .then(({ chunks, filesByChunk }) =>
      renderStack({ chunks, filesByChunk, destinationPath })
    )
