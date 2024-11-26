import { useEffect, useState } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Note: When dark mode url is not set isDarkMode is always false.
    if (process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE) {
      // Check initial color scheme preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDarkMode(mediaQuery.matches)

      // Add listener for changes in color scheme preference
      const handleColorSchemeChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleColorSchemeChange)

      // Cleanup listener
      return () => {
        mediaQuery.removeEventListener('change', handleColorSchemeChange)
      }
    }
  }, [])

  return { isDarkMode }
}
