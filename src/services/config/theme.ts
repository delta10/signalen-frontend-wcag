import { existsSync } from 'node:fs'
import path from 'node:path'

type ThemeConfig = { theme?: string; municipality?: string }

export const getOrganizationTheme = (config: ThemeConfig): string => {
  const theme = config.theme ?? config.municipality ?? 'default'
  if (!/^[a-z0-9-]+$/i.test(theme) || theme === 'default') return 'default'

  const tokensFile = path.join(
    process.cwd(),
    'design-tokens/organizations',
    `${theme}.json`
  )
  const stylesheet = path.join(
    process.cwd(),
    'public/assets/organizations',
    theme,
    'theme.css'
  )

  return existsSync(tokensFile) && existsSync(stylesheet) ? theme : 'default'
}
