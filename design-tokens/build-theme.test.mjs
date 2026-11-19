import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { afterEach, expect, it } from 'vitest'

const tokensDir = path.dirname(fileURLToPath(import.meta.url))
const fixtures = []

afterEach(() => {
  for (const fixture of fixtures.splice(0)) {
    fs.rmSync(fixture, { recursive: true, force: true })
  }
})

const createFixture = () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'signalen-theme-'))
  fixtures.push(fixture)
  const destination = path.join(fixture, 'design-tokens')
  fs.mkdirSync(path.join(destination, 'organizations'), { recursive: true })
  for (const name of ['base.json', 'overrides.json']) {
    fs.copyFileSync(path.join(tokensDir, name), path.join(destination, name))
  }
  return fixture
}

const buildArgs = (organization) => [
  path.join(tokensDir, 'build-theme.mjs'),
  '--org',
  ...(organization ? [organization] : []),
]

const build = (fixture, organization) =>
  spawnSync(process.execPath, buildArgs(organization), {
    cwd: fixture,
    encoding: 'utf8',
  })

const readTheme = (fixture, organization) =>
  fs.readFileSync(
    path.join(
      fixture,
      'public/assets/organizations',
      organization,
      'theme.css'
    ),
    'utf8'
  )

const resolveVariable = (css, variable) => {
  const values = Object.fromEntries(
    [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2],
    ])
  )
  const resolve = (name) =>
    values[name]?.replace(/var\((--[\w-]+)\)/g, (_, reference) =>
      resolve(reference)
    )
  return resolve(variable)
}

it('builds the neutral light and dark defaults without any theme JSON file', () => {
  const fixture = createFixture()
  fs.writeFileSync(
    path.join(fixture, 'config.json'),
    JSON.stringify({ base: { municipality: 'new-town' } })
  )
  const result = build(fixture)
  expect(result.status, result.stderr).toBe(0)
  const css = readTheme(fixture, 'default')
  const light = css.split('@media')[0]
  expect(resolveVariable(light, '--basis-color-default-bg-document')).toBe(
    '#ffffff'
  )
  expect(resolveVariable(light, '--basis-color-action-1-color-default')).toBe(
    '#00205c'
  )
  expect(
    resolveVariable(light, '--utrecht-form-field-label-margin-block-end')
  ).toBe('8px')
  expect(resolveVariable(css, '--basis-color-default-bg-document')).toBe(
    '#1d1d1d'
  )
})

it.each([
  { municipality: 'Nieuwe Gemeente' },
  { theme: '../custom', municipality: 'new-town' },
])('builds the default for an invalid theme name in config %j', (base) => {
  const fixture = createFixture()
  fs.writeFileSync(path.join(fixture, 'config.json'), JSON.stringify({ base }))

  const result = build(fixture)

  expect(result.status, result.stderr).toBe(0)
  expect(readTheme(fixture, 'default')).toContain('.organization-theme')
})

it('rejects an invalid theme name passed explicitly', () => {
  const fixture = createFixture()
  const result = build(fixture, '../custom')

  expect(result.status).toBe(1)
  expect(result.stderr).toContain('Gebruik: npm run tokens:build:org')
})

it('builds the fallback and a partial theme in a full build', () => {
  const fixture = createFixture()
  fs.writeFileSync(
    path.join(fixture, 'design-tokens/organizations/custom.json'),
    JSON.stringify({
      light: { 'basis.color.accent-1.color-default': '#663399' },
      dark: { 'basis.color.accent-1.color-default': '#ccbbee' },
    })
  )
  fs.writeFileSync(
    path.join(fixture, 'config.json'),
    JSON.stringify({ base: { theme: 'custom' } })
  )
  const result = build(fixture)
  expect(result.status, result.stderr).toBe(0)
  expect(result.stdout.match(/voor organisatie "default"/g)).toHaveLength(1)
  expect(readTheme(fixture, 'default')).toContain('.organization-theme')
  const css = readTheme(fixture, 'custom')
  const light = css.split('@media')[0]
  expect(resolveVariable(light, '--basis-color-accent-1-color-default')).toBe(
    '#663399'
  )
  expect(
    resolveVariable(light, '--utrecht-form-fieldset-legend-font-weight')
  ).toBe('700')
  expect(resolveVariable(css, '--basis-color-accent-1-color-default')).toBe(
    '#ccbbee'
  )
})

it('builds a requested theme on its own even with concurrent builds', async () => {
  const fixture = createFixture()
  fs.writeFileSync(
    path.join(fixture, 'design-tokens/organizations/custom.json'),
    JSON.stringify({ light: {} })
  )
  const exec = promisify(execFile)
  const results = await Promise.allSettled(
    [1, 2].map(() =>
      exec(process.execPath, buildArgs('custom'), { cwd: fixture })
    )
  )
  for (const result of results) {
    if (result.status === 'rejected') throw result.reason
  }
  expect(readTheme(fixture, 'custom')).toContain(
    '@media (prefers-color-scheme: dark)'
  )
  expect(
    fs.existsSync(path.join(fixture, 'public/assets/organizations/default'))
  ).toBe(false)
})

it('reports invalid organization JSON instead of silently replacing it', () => {
  const fixture = createFixture()
  fs.writeFileSync(
    path.join(fixture, 'design-tokens/organizations/custom.json'),
    '{invalid'
  )
  expect(build(fixture, 'custom').status).not.toBe(0)
})
