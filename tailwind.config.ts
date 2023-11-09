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
        error: configuration.theme.error_colour,
        hover: configuration.theme.hover_colour,
        border: configuration.theme.border_colour,
        focus: configuration.theme.focus_colour,
        focus_visible: configuration.theme.focus_visible_colour,
        link: configuration.theme.link.colour,
        active_link: configuration.theme.link.active_colour,
        hover_link: configuration.theme.link.hover_colour,
        focus_link: configuration.theme.link.focus_colour,
        focus_visible_link: configuration.theme.link.focus_visible_colour,
        light_text: configuration.theme.light_text,
      },
      fontFamily: {
        sans: ['var(--custom-font)}'],
      },
    },
  },
  plugins: [],
}
export default config
