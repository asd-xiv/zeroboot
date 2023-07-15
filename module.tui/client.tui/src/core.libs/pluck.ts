export type PickFn = <T extends Record<string, any>, K extends keyof T>(
  keys: K[],
  input: T
) => Pick<T, K>

export const pick: PickFn = (keys, input) => {
  const result = {} as any

  keys.forEach(key => {
    result[key] = input[key]
  })

  return result
}
