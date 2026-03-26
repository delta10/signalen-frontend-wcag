/**
 * Thema-configuratie voor NL Design System.
 * Switch tussen Purmerend en Utrecht door 'theme' in config.json aan te passen.
 */
export type ThemeId = 'purmerend' | 'utrecht'

export type ThemeConfig = {
  /** CSS class voor het thema (bijv. purmerend-theme) */
  themeClass: string
  /** CSS class voor media-query variant (responsive) */
  mediaQueryClass: string
  /** CSS class voor dark mode */
  darkModeClass: string
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  purmerend: {
    themeClass: 'purmerend-theme',
    mediaQueryClass: 'purmerend-theme--media-query',
    darkModeClass: 'purmerend-theme--color-scheme-dark',
  },
  utrecht: {
    themeClass: 'utrecht-theme',
    mediaQueryClass: '', // Utrecht heeft geen aparte media-query variant
    darkModeClass: 'utrecht-theme--dark',
  },
}
