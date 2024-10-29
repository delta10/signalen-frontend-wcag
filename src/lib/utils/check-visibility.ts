// Recursive function to evaluate if conditions are met
import { FieldValues } from 'react-hook-form'

export const evaluateConditions = (
  conditions: Record<string, any>,
  watchValues: FieldValues
): boolean => {
  if (!conditions) return true

  console.log(watchValues)

  // Handle `ifOneOf` condition
  if (conditions.ifOneOf) {
    return Object.entries(conditions.ifOneOf).some(([key, value]): boolean => {
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // If `value` is a nested condition object (e.g., { ifOneOf: { ... } }),
        // pass it as `{ [key]: value }` to keep the full structure for evaluation.
        return evaluateConditions({ [key]: value }, watchValues)
      }

      if (Array.isArray(value)) {
        // If both `watchValues[key]` and `value` are arrays, check for any intersection
        if (Array.isArray(watchValues[key])) {
          return watchValues[key].some((item) => value.includes(item))
        }

        // Otherwise, check if `watchValues[key]` matches any element in `value`
        return value.includes(watchValues[key])
      }

      // If `value` is not an array, directly compare `watchValues[key]` with `value`
      return watchValues[key] === value
    })
  }

  // Handle `ifAllOf` condition
  if (conditions.ifAllOf) {
    return Object.entries(conditions.ifAllOf).every(([key, value]): boolean => {
      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        // If `value` is a nested condition object (e.g., { ifOneOf: { ... } }),
        // pass it as `{ [key]: value }` to keep the full structure for evaluation.
        return evaluateConditions({ [key]: value }, watchValues)
      }

      if (Array.isArray(value)) {
        // If both `watchValues[key]` and `value` are arrays, check for full inclusion of `value` items in `watchValues[key]`
        if (Array.isArray(watchValues[key])) {
          const arrayToCheckAgainst = watchValues[key].filter(
            (item) => item !== false && item !== 'empty'
          )

          // Return true if every item in `value` is in `arrayToCheckAgainst`
          return value.every((item) => arrayToCheckAgainst.includes(item))
        }

        // Otherwise, check if `watchValues[key]` matches any element in `value`
        return value.includes(watchValues[key])
      }

      // If `value` is not an array, directly compare `watchValues[key]` with `value`
      return watchValues[key] === value
    })
  }

  return true
}
