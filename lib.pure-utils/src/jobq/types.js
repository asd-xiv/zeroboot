/**
 * @template [T=any]
 * @typedef {object} Job
 * @property {string} [name]
 * @property {Record<string, any>} [context]
 * @property {(context: Record<string, any>) => T | Promise<T>} work
 */

export {}
