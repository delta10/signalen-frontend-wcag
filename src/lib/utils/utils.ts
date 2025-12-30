/**
 * Deep merge two objects
 */
export function merge<T extends Record<string, any>>(
  target: Record<string, any>,
  ...sources: (Partial<T> | T)[]
): T {
  if (!sources.length) return target as T
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key] as any, source[key] as any)
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return merge(target, ...sources)
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Create a debounced function that delays invoking func until after wait milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | undefined

  const debouncedFunc = (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), wait)
  }

  debouncedFunc.cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return debouncedFunc
}

/**
 * Create an array with unique values based on a property
 */
export function uniqBy<T>(array: T[], iteratee: keyof T | string): T[] {
  const seen = new Set()
  return array.filter((item) => {
    const key = (item as any)[iteratee]
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

/**
 * Pick specific properties from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>

  for (const key of keys) {
    if (key in object) {
      result[key] = object[key]
    }
  }

  return result
}
