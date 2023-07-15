export type FindWith = <T extends Record<string, any>>(
  subset: Partial<T>,
  input: T[]
) => T | undefined

export const findWith: FindWith = (subset, input) => {
  const keys = Object.keys(subset)

  return input.find(item => keys.every(key => item[key] === subset[key]))
}

export type GetWith = <T extends Record<string, any>>(
  subset: Partial<T>,
  input: T[]
) => T

export const getWith: GetWith = (subset, input) => {
  const keys = Object.keys(subset)
  const result = input.find(item =>
    keys.every(key => item[key] === subset[key])
  )

  if (!result) {
    throw new Error(`getWith: Item with ${JSON.stringify(subset)} not found`)
  }

  return result
}
