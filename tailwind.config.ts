import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--custom-font)'],
      },
      boxShadow: {
        right: '4px 0 10px -2px rgba(0, 0, 0, 0.1)',
        bottom: '0 4px 10px -2px rgba(0, 0, 0, 0.1)',
        top: '0 -4px 10px -2px rgba(0, 0, 0, 0.1)',
      },
      textColor: {
        primary: 'var(--basis-color-text-text-1)',
      },
      backgroundColor: {
        primary: 'var(--basis-color-text-text-1)', // or use another var like --basis-color-background-1
      },
    },
  },
  plugins: [],
}

export default config
