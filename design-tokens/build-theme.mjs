import StyleDictionary from 'style-dictionary'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { applyTokenUpdates } from './merge-token-updates.mjs'

const require = createRequire(import.meta.url)
const { createConfig } = require('./style-dictionary-config.cjs')

const args = process.argv.slice(2)

const orgFlagIndex = args.indexOf('--org')

const isSafeOrganizationName = (name) =>
  typeof name === 'string' &&
  /^[a-z0-9-]+$/i.test(name) &&
  !name.startsWith('--')

// Reads config.json and returns the configured theme organization.
// Prefer `base.theme` to match runtime theme loading, fallback to `base.municipality`.
const getOrganizationFromConfig = () => {
  const configPath = path.resolve('config.json')
  if (!fs.existsSync(configPath)) return 'default'

  const configRaw = fs.readFileSync(configPath, 'utf8')
  const config = JSON.parse(configRaw)
  const name = config?.base?.theme ?? config?.base?.municipality
  return isSafeOrganizationName(name) ? name : 'default'
}

const organizationFromArg =
  orgFlagIndex >= 0 ? args[orgFlagIndex + 1] : undefined

if (
  organizationFromArg !== undefined &&
  !isSafeOrganizationName(organizationFromArg)
) {
  throw new Error(
    'Gebruik: npm run tokens:build:org -- <organisatie> of zet config.base.theme (fallback: config.base.municipality) in config.json'
  )
}

const organization = organizationFromArg ?? getOrganizationFromConfig()

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

const buildOrganization = async (organization, organizationUpdates = {}) => {
  const tokenUpdates = mergeUpdateLayers(sharedOverrides, organizationUpdates)

  const { lightTokens, darkTokens } = applyTokenUpdates(
    baseTokens,
    tokenUpdates
  )
  const tempDir = path.resolve('tmp')
  fs.mkdirSync(tempDir, { recursive: true })
  const workDir = fs.mkdtempSync(path.join(tempDir, `${organization}-`))

  try {
    const lightTokensFile = path.join(workDir, 'light.tokens.json')
    const darkTokensFile = path.join(workDir, 'dark.tokens.json')
    fs.writeFileSync(
      lightTokensFile,
      `${JSON.stringify(lightTokens, null, 2)}\n`
    )
    fs.writeFileSync(darkTokensFile, `${JSON.stringify(darkTokens, null, 2)}\n`)

    const lightConfig = createConfig({
      selector: '.organization-theme',
      source: [lightTokensFile],
      buildPath: `${workDir}/`,
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
      buildPath: `${workDir}/`,
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

    const lightThemePath = path.join(workDir, 'theme.light.css')
    const darkThemePath = path.join(workDir, 'theme.dark.css')
    const finalThemePath = path.join(workDir, 'theme.css')
    const lightThemeCss = fs.readFileSync(lightThemePath, 'utf8').trim()
    const darkThemeCss = fs.readFileSync(darkThemePath, 'utf8').trim()
    const finalThemeCss = `${lightThemeCss}\n\n@media (prefers-color-scheme: dark) {\n  .organization-theme.organization-theme--media-query {\n    color-scheme: light dark;\n  }\n${darkThemeCss}\n}\n`

    fs.writeFileSync(finalThemePath, finalThemeCss)
    const outputDir = path.resolve('public/assets/organizations', organization)
    fs.mkdirSync(outputDir, { recursive: true })
    // Publish complete files without removing the CSS another build may be serving.
    const publishDir = fs.mkdtempSync(path.join(outputDir, '.build-'))
    try {
      for (const file of ['theme.css', 'variables.css']) {
        const stagedFile = path.join(publishDir, file)
        fs.copyFileSync(path.join(workDir, file), stagedFile)
        fs.renameSync(stagedFile, path.join(outputDir, file))
      }
    } finally {
      fs.rmSync(publishDir, { recursive: true, force: true })
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }

  console.log(`Tokens gegenereerd voor organisatie "${organization}"`)
}

if (!organizationFromArg || organization === 'default') {
  await buildOrganization('default')
}

if (organization !== 'default') {
  const organizationTokensFile = path.join(
    organizationsDir,
    `${organization}.json`
  )

  if (fs.existsSync(organizationTokensFile)) {
    const updates = JSON.parse(fs.readFileSync(organizationTokensFile, 'utf8'))
    await buildOrganization(organization, updates)
  } else {
    console.log(
      `Geen organisatie-updates voor "${organization}"; de frontend gebruikt het standaardthema.`
    )
  }
}
