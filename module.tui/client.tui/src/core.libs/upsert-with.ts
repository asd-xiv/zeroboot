import { findIndexWith } from "./find-index-with.js"

export type UpsertWith = <T extends Record<string, any>>(
  subset: Partial<T>,
  item: T,
  input: T[]
) => T[]

export const upsertWith: UpsertWith = (subset, newItem, input) => {
  const result = [...input, newItem]

  return result.reduce((acc, current) => {
    const index = findIndexWith(subset, acc)

    if (index === -1) {
      return [...acc, current]
    }

    acc[index] = {
      ...acc[index],
      ...current,
    }

    return acc
  }, [] as typeof input)
}
