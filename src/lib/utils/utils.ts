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
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue
      }

      // Handle arrays: replace instead of merge
      if (Array.isArray(source[key])) {
        Object.assign(target, { [key]: source[key] })
        continue
      }

      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        merge(target[key], source[key])
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
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  let timeoutId: NodeJS.Timeout | undefined
  let latestArgs: Parameters<T> | undefined
  let hasPendingCall = false

  const debouncedFunc = (...args: Parameters<T>) => {
    latestArgs = args
    hasPendingCall = true
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      hasPendingCall = false
      latestArgs = undefined
      func(...args)
    }, wait)
  }

  debouncedFunc.cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = undefined
    latestArgs = undefined
    hasPendingCall = false
  }

  debouncedFunc.flush = () => {
    if (hasPendingCall && latestArgs) {
      clearTimeout(timeoutId)
      timeoutId = undefined
      const args = latestArgs
      latestArgs = undefined
      hasPendingCall = false
      func(...args)
    }
  }

  return debouncedFunc
}

/**
 * Create an array with unique values based on a property
 */
export function uniqBy<T>(array: T[], iteratee: keyof T | string): T[] {
  const seen = new Set()
  return array.filter((item, index) => {
    const rawKey = (item as any)[iteratee]
    // Handle null/undefined values uniquely by combining with index
    const key = rawKey == null ? `__null_${index}__` : rawKey
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
