/**
 * Style Dictionary config voor NL Button tokens.
 *
 * Genereert nl-button-tokens.generated.css uit nl-button-tokens.json.
 * De tokens refereren naar basis tokens (--basis-*, --utrecht-*) die door
 * het theme package worden geleverd (Purmerend, Utrecht, Start, etc.).
 *
 * Gebruik: npx style-dictionary build --config design-tokens/style-dictionary.config.mjs
 */
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  source: [join(__dirname, 'nl-button-tokens.json')],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: join(__dirname, '../public/assets/'),
      files: [
        {
          destination: 'nl-button-tokens.generated.css',
          format: 'css/variables',
          options: {
            outputReferences: false,
            selector: ':root',
          },
        },
      ],
    },
  },
}

export default config
