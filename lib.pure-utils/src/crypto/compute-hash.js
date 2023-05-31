import crypto from "node:crypto"

/**
 * Build a hash from a string
 * @param {string} input
 * @returns {string}
 */
export const computeHash = input =>
  crypto.createHash("sha256").update(input).digest("hex")
