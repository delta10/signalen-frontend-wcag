import { useEffect, useState } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
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
  }, [])

  return { isDarkMode }
}
