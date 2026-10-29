import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { applyTokenUpdates } from './merge-token-updates.mjs'

const require = createRequire(import.meta.url)
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

// Import the token values and types, without generated Style Dictionary metadata.
const readTokenTree = (tree) => {
  if (!isObject(tree)) {
    throw new Error('Tokenbron moet een DTCG-tokenobject bevatten.')
  }
  if ('$value' in tree) {
    return {
      $value: tree.$value,
      ...(tree.$type ? { $type: tree.$type } : {}),
    }
  }
  return Object.fromEntries(
    Object.entries(tree)
      .filter(([key]) => !key.startsWith('$'))
      .map(([key, value]) => [key, readTokenTree(value)])
  )
}

export const loadTokenSources = (source, organizationTokensFile) => {
  if (source === undefined) return { light: {}, dark: {}, aliases: {} }

  const sources = typeof source === 'string' ? { light: source } : source
  if (!isObject(sources) || typeof sources.light !== 'string') {
    throw new Error(
      'Organisatie tokenbron moet een bestandspad of { "light": "...", "dark": "..." } zijn.'
    )
  }

  const readJson = (filePath) => {
    if (typeof filePath !== 'string' || filePath.trim() === '') {
      throw new Error(
        'Organisatie tokenbron moet een niet-leeg bestandspad zijn.'
      )
    }
    const resolvedPath =
      filePath.startsWith('.') || path.isAbsolute(filePath)
        ? path.resolve(path.dirname(organizationTokensFile), filePath)
        : require.resolve(filePath)
    return JSON.parse(fs.readFileSync(resolvedPath, 'utf8'))
  }

  return {
    light: readTokenTree(readJson(sources.light)),
    dark:
      sources.dark === undefined ? {} : readTokenTree(readJson(sources.dark)),
    aliases: sources.adapter === undefined ? {} : readJson(sources.adapter),
  }
}

const getToken = (tokens, tokenPath) =>
  tokenPath.split('.').reduce((node, key) => node?.[key], tokens)

const setToken = (tokens, tokenPath, token) => {
  const segments = tokenPath.split('.')
  const name = segments.pop()
  const parent = segments.reduce((node, key) => (node[key] ??= {}), tokens)
  parent[name] = structuredClone(token)
}

const applyAliases = (tokens, aliases = {}) => {
  const result = structuredClone(tokens)
  for (const [target, reference] of Object.entries(aliases)) {
    const token = typeof reference === 'string' && getToken(tokens, reference)
    if (!isObject(token) || !('$value' in token)) {
      throw new Error(
        `Onbekende tokenreferentie voor "${target}": "${reference}".`
      )
    }
    setToken(result, target, {
      $value: `{${reference}}`,
      ...(token.$type ? { $type: token.$type } : {}),
    })
  }
  return result
}

const applyUpdates = (tokens, updates, baseTokens) => {
  const result = structuredClone(tokens)
  for (const tokenPath of Object.keys(updates)) {
    if (getToken(result, tokenPath) !== undefined) continue
    // Restore only explicitly overridden application tokens omitted upstream.
    // Other omitted component tokens retain the component's CSS fallbacks.
    const baseToken = getToken(baseTokens, tokenPath)
    if (!isObject(baseToken) || !('$value' in baseToken)) {
      throw new Error(`Unknown token update path "${tokenPath}".`)
    }
    setToken(result, tokenPath, baseToken)
  }
  return applyTokenUpdates(result, { light: updates }).lightTokens
}

export const createOrganizationTokens = (
  baseTokens,
  sharedUpdates,
  organizationUpdates,
  sources
) => {
  // An imported namespace is authoritative. Keeping omitted component tokens
  // from base.json would override the upstream component's own CSS fallbacks.
  const lightTokens = applyUpdates(
    applyAliases({ ...baseTokens, ...sources.light }, sources.aliases),
    { ...sharedUpdates.light, ...organizationUpdates.light },
    baseTokens
  )

  // Full upstream dark exports must not erase our light application overrides.
  // Reapply those defaults, followed by explicit shared/organization dark values.
  const darkTokens = applyUpdates(
    applyAliases({ ...lightTokens, ...sources.dark }, sources.aliases),
    {
      ...sharedUpdates.light,
      ...organizationUpdates.light,
      ...sharedUpdates.dark,
      ...organizationUpdates.dark,
    },
    baseTokens
  )
  return { lightTokens, darkTokens }
}
