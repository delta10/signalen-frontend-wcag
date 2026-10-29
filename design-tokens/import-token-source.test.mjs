import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import {
  createOrganizationTokens,
  loadTokenSources,
} from './import-token-source.mjs'

const token = ($value) => ({ $type: 'color', $value })
const base = {
  example: { color: token('base'), omitted: token('base fallback') },
  product: { color: token('product default') },
}

describe('organization token sources', () => {
  it('preserves existing light/dark precedence without an import', () => {
    const result = createOrganizationTokens(
      base,
      {
        light: { 'example.color': 'shared' },
        dark: { 'example.color': 'shared dark' },
      },
      {
        light: { 'product.color': 'organization' },
        dark: { 'example.color': 'organization dark' },
      },
      loadTokenSources(undefined)
    )
    expect(result.lightTokens.example.color.$value).toBe('shared')
    expect(result.darkTokens.example.color.$value).toBe('organization dark')
    expect(result.darkTokens.product.color.$value).toBe('organization')
    expect(base.example.color.$value).toBe('base')
  })

  it('imports complete namespaces and removes omitted base component tokens', () => {
    const result = createOrganizationTokens(
      base,
      {},
      {},
      {
        light: { example: { color: token('source'), new: token('new token') } },
        dark: {},
      }
    )
    expect(result.lightTokens.example).toEqual({
      color: token('source'),
      new: token('new token'),
    })
    expect(result.lightTokens.product).toEqual(base.product)
    expect(result.darkTokens).toEqual(result.lightTokens)
  })

  it('layers organization overrides over the imported source in each mode', () => {
    const result = createOrganizationTokens(
      base,
      { dark: { 'example.omitted': 'shared dark fallback' } },
      {
        light: { 'example.color': 'organization' },
        dark: { 'example.color': 'organization dark' },
      },
      {
        light: { example: { color: token('source light') } },
        dark: { example: { color: token('source dark') } },
      }
    )
    expect(result.lightTokens.example.color.$value).toBe('organization')
    expect(result.darkTokens.example).toEqual({
      color: token('organization dark'),
      omitted: token('shared dark fallback'),
    })
  })

  it('applies shared overrides after the import and adapter in both modes', () => {
    const result = createOrganizationTokens(
      base,
      {
        light: {
          'example.omitted': 'app layout',
          'product.color': 'app color',
        },
      },
      {},
      {
        light: { example: { color: token('source light') } },
        dark: { example: { color: token('source dark') } },
        aliases: { 'product.color': 'example.color' },
      }
    )
    for (const theme of [result.lightTokens, result.darkTokens]) {
      expect(theme.example.omitted.$value).toBe('app layout')
      expect(theme.product.color.$value).toBe('app color')
    }
  })

  it('preserves organization light corrections when loading a full dark export', () => {
    const result = createOrganizationTokens(
      base,
      {},
      { light: { 'example.color': '{product.color}' } },
      {
        light: { example: { color: token('source light') } },
        dark: { example: { color: token('source dark') } },
      }
    )
    expect(result.darkTokens.example.color.$value).toBe('{product.color}')
  })

  it('keeps compatibility aliases as references to the current mode', () => {
    const result = createOrganizationTokens(
      base,
      {},
      {},
      {
        light: { example: { new: token('light') } },
        dark: { example: { new: token('dark') } },
        aliases: { 'product.color': 'example.new' },
      }
    )
    expect(result.lightTokens.product.color).toEqual(token('{example.new}'))
    expect(result.darkTokens.product.color).toEqual(token('{example.new}'))
    expect(result.darkTokens.example.new.$value).toBe('dark')
  })

  it('fails for unknown aliases and manual update paths', () => {
    expect(() =>
      createOrganizationTokens(
        base,
        {},
        {},
        { light: {}, dark: {}, aliases: { 'product.color': 'unknown.color' } }
      )
    ).toThrow('Onbekende tokenreferentie')
    expect(() =>
      createOrganizationTokens(
        base,
        {},
        { light: { 'unknown.color': 'value' } },
        loadTokenSources(undefined)
      )
    ).toThrow('Unknown token update path')
  })

  it('imports the published Utrecht themes and validates every compatibility reference', () => {
    const organizationFile = path.resolve(
      'design-tokens/organizations/utrecht.json'
    )
    const organization = JSON.parse(fs.readFileSync(organizationFile, 'utf8'))
    const baseTokens = JSON.parse(
      fs.readFileSync('design-tokens/base.json', 'utf8')
    )
    const shared = JSON.parse(
      fs.readFileSync('design-tokens/overrides.json', 'utf8')
    )
    const sources = loadTokenSources(organization.source, organizationFile)
    const result = createOrganizationTokens(
      baseTokens,
      shared,
      organization,
      sources
    )
    expect(result.lightTokens.utrecht.document).toEqual(
      sources.light.utrecht.document
    )
    expect(result.darkTokens.utrecht.document).toEqual(
      sources.dark.utrecht.document
    )
    expect(result.lightTokens.utrecht.checkbox).toEqual(
      sources.light.utrecht.checkbox
    )
    expect(result.darkTokens.utrecht.checkbox).toEqual(
      sources.dark.utrecht.checkbox
    )
    expect(result.lightTokens.utrecht.root['background-color'].$value).toBe(
      '{utrecht.document.background-color}'
    )
    expect(result.darkTokens.utrecht.root['background-color'].$value).toBe(
      '{utrecht.document.background-color}'
    )
    expect(result.lightTokens.utrecht.document['font-family'].$value).toContain(
      'Noto Sans Variable'
    )
    expect(
      result.darkTokens.utrecht.document['background-color'].$value
    ).not.toBe(result.lightTokens.utrecht.document['background-color'].$value)
    expect(
      Object.values(sources.aliases).every((reference) =>
        reference.startsWith('utrecht.')
      )
    ).toBe(true)
    for (const theme of [result.lightTokens, result.darkTokens]) {
      expect(theme.utrecht.textarea['max-inline-size'].$value).toBe('100%')
      expect(theme.utrecht.accordion.section['border-width'].$value).toBe('0')
      expect(theme.nl.button['padding-inline-start'].$value).toBe(
        '{basis.space.inline.3xl}'
      )
    }
  })

  it('accepts a light-only source and rejects malformed source declarations', () => {
    const sources = loadTokenSources('@utrecht/design-tokens/dist/tokens.json')
    expect(sources.light.utrecht.document.color.$value).toBeDefined()
    expect(sources.dark).toEqual({})
    for (const source of [
      null,
      42,
      {},
      { light: '' },
      { light: 'unused', dark: false },
    ]) {
      expect(() => loadTokenSources(source)).toThrow()
    }
  })
})
