/**
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
export const delay = async milliseconds =>
  new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
