import StyleDictionary from 'style-dictionary'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
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

// Combines shared overrides with organization-specific updates per theme layer.
const mergeUpdateLayers = (sharedUpdates, organizationUpdates) => ({
  light: {
    ...(sharedUpdates.light ?? {}),
    ...organizationUpdates.light,
  },
  dark: {
    ...(sharedUpdates.dark ?? {}),
    ...(organizationUpdates.dark ?? {}),
  },
})

if (!organization || organization.startsWith('--')) {
  throw new Error(
    'Gebruik: npm run tokens:build:org -- <organisatie> of zet config.base.theme (fallback: config.base.municipality) in config.json'
  )
}

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

const organizationTokensFile = path.resolve(
  `design-tokens/organizations/${organization}.json`
)
if (!fs.existsSync(organizationTokensFile)) {
  throw new Error(
    `Organisatie updates niet gevonden: ${organizationTokensFile}`
  )
}

const organizationUpdatesRaw = fs.readFileSync(organizationTokensFile, 'utf8')
const organizationUpdates = JSON.parse(organizationUpdatesRaw)
const tokenUpdates = mergeUpdateLayers(sharedOverrides, organizationUpdates)

const { lightTokens, darkTokens } = applyTokenUpdates(baseTokens, tokenUpdates)
const tempDir = path.resolve('tmp')
fs.mkdirSync(tempDir, { recursive: true })
const lightTokensFile = path.resolve(
  tempDir,
  `${organization}.light.tokens.json`
)
const darkTokensFile = path.resolve(tempDir, `${organization}.dark.tokens.json`)
fs.writeFileSync(lightTokensFile, `${JSON.stringify(lightTokens, null, 2)}\n`)
fs.writeFileSync(darkTokensFile, `${JSON.stringify(darkTokens, null, 2)}\n`)
const organizationBuildPath = path.resolve(
  `public/assets/organizations/${organization}/`
)
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
const finalThemeCss = `${lightThemeCss}\n\n@media (prefers-color-scheme: dark) {color-scheme: light dark; \n${darkThemeCss}\n}\n`

fs.writeFileSync(finalThemePath, finalThemeCss)
fs.rmSync(lightThemePath, { force: true })
fs.rmSync(darkThemePath, { force: true })

console.log(`Tokens gegenereerd voor organisatie "${organization}"`)
