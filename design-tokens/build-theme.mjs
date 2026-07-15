import StyleDictionary from 'style-dictionary'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { createImportedTokenUpdates } from './import-token-source.mjs'
import { applyTokenUpdates } from './merge-token-updates.mjs'

const require = createRequire(import.meta.url)
const { createConfig } = require('./style-dictionary-config.cjs')

const args = process.argv.slice(2)

const orgFlagIndex = args.indexOf('--org')

// Reads config.json and returns the configured theme organization.
// Prefer `base.theme` to match runtime theme loading, fallback to `base.municipality`.
const getOrganizationFromConfig = () => {
  const configPath = path.resolve('config.json')
  if (!fs.existsSync(configPath)) return null

  const configRaw = fs.readFileSync(configPath, 'utf8')
  const config = JSON.parse(configRaw)
  return config?.base?.theme ?? config?.base?.municipality ?? null
}

const organizationFromArg = orgFlagIndex >= 0 ? args[orgFlagIndex + 1] : null
const organization = organizationFromArg ?? getOrganizationFromConfig()

const isSafeOrganizationName =
  typeof organization === 'string' && /^[a-z0-9-]+$/i.test(organization)

if (!isSafeOrganizationName || organization.startsWith('--')) {
  throw new Error(
    'Gebruik: npm run tokens:build:org -- <organisatie> of zet config.base.theme (fallback: config.base.municipality) in config.json'
  )
}

const organizationsDir = path.resolve('design-tokens/organizations')
const baseTokensFile = path.resolve('design-tokens/base.json')
if (!fs.existsSync(baseTokensFile)) {
  throw new Error(`Basis tokenbestand niet gevonden: ${baseTokensFile}`)
}

const baseTokensRaw = fs.readFileSync(baseTokensFile, 'utf8')
const baseTokens = JSON.parse(baseTokensRaw)

const sharedOverridesFile = path.resolve('design-tokens/overrides.json')
if (!fs.existsSync(sharedOverridesFile)) {
  throw new Error(
    `Gedeelde token overrides niet gevonden: ${sharedOverridesFile}`
  )
}

const sharedOverridesRaw = fs.readFileSync(sharedOverridesFile, 'utf8')
const sharedOverrides = JSON.parse(sharedOverridesRaw)

// Later layers override earlier layers for both light and dark mode.
const mergeUpdateLayers = (...layers) => ({
  light: Object.assign({}, ...layers.map((layer) => layer.light ?? {})),
  dark: Object.assign({}, ...layers.map((layer) => layer.dark ?? {})),
})

const organizationTokensFile = path.join(
  organizationsDir,
  `${organization}.json`
)
if (!fs.existsSync(organizationTokensFile)) {
  throw new Error(
    `Organisatie updates niet gevonden: ${organizationTokensFile}`
  )
}

const organizationUpdatesRaw = fs.readFileSync(organizationTokensFile, 'utf8')
const organizationUpdates = JSON.parse(organizationUpdatesRaw)

let importedUpdates = { light: {}, dark: {} }
if (organizationUpdates.source) {
  if (typeof organizationUpdates.source !== 'string') {
    throw new Error('Organisatie tokenbron moet een bestandspad zijn.')
  }

  const isFilePath =
    organizationUpdates.source.startsWith('.') ||
    path.isAbsolute(organizationUpdates.source)
  const importedTokensFile = isFilePath
    ? path.resolve(
        path.dirname(organizationTokensFile),
        organizationUpdates.source
      )
    : require.resolve(organizationUpdates.source)
  if (!fs.existsSync(importedTokensFile)) {
    throw new Error(
      `Organisatie tokenbron niet gevonden: ${importedTokensFile}`
    )
  }

  const importedTokensRaw = fs.readFileSync(importedTokensFile, 'utf8')
  const importedTokens = JSON.parse(importedTokensRaw)
  importedUpdates = createImportedTokenUpdates(importedTokens, baseTokens)
}

const tokenUpdates = mergeUpdateLayers(
  sharedOverrides,
  importedUpdates,
  organizationUpdates
)

const { lightTokens, darkTokens } = applyTokenUpdates(baseTokens, tokenUpdates)
const tempDir = path.resolve('tmp')
fs.mkdirSync(tempDir, { recursive: true })
const lightTokensFile = path.join(tempDir, `${organization}.light.tokens.json`)
const darkTokensFile = path.join(tempDir, `${organization}.dark.tokens.json`)
fs.writeFileSync(lightTokensFile, `${JSON.stringify(lightTokens, null, 2)}\n`)
fs.writeFileSync(darkTokensFile, `${JSON.stringify(darkTokens, null, 2)}\n`)
const organizationsOutputDir = path.resolve('public/assets/organizations')
const organizationBuildPath = path.join(organizationsOutputDir, organization)
fs.rmSync(organizationBuildPath, { recursive: true, force: true })

const lightConfig = createConfig({
  selector: '.organization-theme',
  source: [lightTokensFile],
  buildPath: `${organizationBuildPath}/`,
  className: 'organization-theme',
  useTokensStudioTransformGroup: false,
  platforms: ['css'],
  cssThemeDestination: 'theme.light.css',
  cssVariablesDestination: 'variables.css',
  includeCssVariablesFile: true,
  cssSelector: '.organization-theme',
})

const darkConfig = createConfig({
  selector: '.organization-theme.organization-theme--media-query',
  source: [darkTokensFile],
  buildPath: `${organizationBuildPath}/`,
  className: 'organization-theme',
  useTokensStudioTransformGroup: false,
  platforms: ['css'],
  cssThemeDestination: 'theme.dark.css',
  includeCssVariablesFile: false,
  cssSelector: '.organization-theme.organization-theme--media-query',
})

const lightStyleDictionary = new StyleDictionary(lightConfig)
await lightStyleDictionary.buildAllPlatforms()

const darkStyleDictionary = new StyleDictionary(darkConfig)
await darkStyleDictionary.buildAllPlatforms()

const lightThemePath = path.resolve(organizationBuildPath, 'theme.light.css')
const darkThemePath = path.resolve(organizationBuildPath, 'theme.dark.css')
const finalThemePath = path.resolve(organizationBuildPath, 'theme.css')
const lightThemeCss = fs.readFileSync(lightThemePath, 'utf8').trim()
const darkThemeCss = fs.readFileSync(darkThemePath, 'utf8').trim()
const finalThemeCss = `${lightThemeCss}\n\n@media (prefers-color-scheme: dark) {\n  .organization-theme.organization-theme--media-query {\n    color-scheme: light dark;\n  }\n${darkThemeCss}\n}\n`

fs.writeFileSync(finalThemePath, finalThemeCss)
fs.rmSync(lightThemePath, { force: true })
fs.rmSync(darkThemePath, { force: true })

console.log(`Tokens gegenereerd voor organisatie "${organization}"`)
