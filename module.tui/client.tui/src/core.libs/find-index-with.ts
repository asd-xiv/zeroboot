/* eslint-disable no-underscore-dangle */

type FindIndexWith = <T extends Record<string, any>>(
  subset: Partial<T>,
  input: T[]
) => number

export const findIndexWith: FindIndexWith = (subset, array) => {
  const keys = Object.keys(subset)

  return array.findIndex(item => keys.every(key => item[key] === subset[key]))
}

// type CurriedFindIndexWith = <T extends Record<string, any>>(
//   subset: Partial<T>
// ) => (input: T[]) => number

// export const findIndexWith: FindIndexWith & CurriedFindIndexWith = (
//   ...parameters
// ) => {
//   if (parameters.length === 1) {
//     return input => _findIndexWith(parameters[0], input)
//   }

//   return _findIndexWith(...parameters)
// }
