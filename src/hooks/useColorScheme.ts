'use client'

import { useState, useEffect } from 'react'

export type ColorScheme = 'light' | 'dark'

/**
 * Returns the user's preferred color scheme.
 * Defaults to 'light' during SSR to avoid hydration mismatch.
 */
export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setScheme(mediaQuery.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => {
      setScheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return scheme
}
