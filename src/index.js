/**
 * @typedef {import("inquirer").DistinctQuestion} DistinctQuestion
 */

/**
 * @typedef {Object} Chunk
 *
 * @property {string}             name
 * @property {DistinctQuestion[]} [ask]
 */

/**
 * @typedef {Object} Stack
 *
 * @property {string}   name
 * @property {Object}   chunks
 * @property {string[]} chunks.required
 * @property {string[]} [chunks.optional]
 */

/**
 * @typedef {Object} PackageJSON
 *
 * @property {string} name
 * @property {string} description
 * @property {string} version
 */

export { build } from "./cmd.build/build.js"
