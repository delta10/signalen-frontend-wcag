'use client'

import { Root } from '@utrecht/root-react/dist/css'
import { useColorScheme } from '@/hooks/useColorScheme'
import { THEMES, type ThemeId } from '@/lib/theme'

type ThemeRootProps = React.ComponentProps<typeof Root> & {
  theme?: ThemeId
}

/**
 * Root met NL Design System thema + dark mode support.
 * Thema wordt bepaald via config.json (base.theme: 'purmerend' | 'utrecht').
 */
export function ThemeRoot({ theme = 'purmerend', className = '', ...props }: ThemeRootProps) {
  const isDark = useColorScheme() === 'dark'
  const { themeClass, mediaQueryClass, darkModeClass } = THEMES[theme]

  const classes = [
    className,
    themeClass,
    mediaQueryClass,
    isDark ? darkModeClass : '',
  ]
    .filter(Boolean)
    .join(' ')

  return <Root className={classes.trim()} {...props} />
}
