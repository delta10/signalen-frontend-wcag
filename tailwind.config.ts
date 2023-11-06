import type { Config } from 'tailwindcss'
import configuration from './configuration.json'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: configuration.theme.primary_colour,
        secondary: configuration.theme.secondary_colour,
        hover: configuration.theme.hover_colour,
        border: configuration.theme.border_colour,
        focus: configuration.theme.focus_colour,
        focus_visible: configuration.theme.focus_visible_colour,
      },
      fontFamily: {
        sans: ['var(--custom-font)}'],
      },
    },
  },
  plugins: [],
}
export default config
