/**
 * Get environment variable or throw an error if it's not defined.
 * @param {string} name
 * @returns {string}
 */
export const getEnvironmentVariable = name => {
  const value = process.env[name]

  if (value) {
    return value
  }

  throw new Error(`Environment variable ${name} is not defined.`)
}
