import { existsSync } from 'node:fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getOrganizationTheme } from './theme'

vi.mock('node:fs', () => {
  const existsSync = vi.fn()
  return { existsSync, default: { existsSync } }
})

beforeEach(() => vi.mocked(existsSync).mockReset())

describe('getOrganizationTheme', () => {
  it('uses the neutral default without an organization', () => {
    expect(getOrganizationTheme({})).toBe('default')
    expect(existsSync).not.toHaveBeenCalled()
  })

  it('uses an available organization theme', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    expect(
      getOrganizationTheme({ theme: 'brabant', municipality: 'other' })
    ).toBe('brabant')
  })

  it('uses the municipality theme when no explicit theme is configured', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    expect(getOrganizationTheme({ municipality: 'brabant' })).toBe('brabant')
  })

  it('ignores an old generated stylesheet without an organization JSON file', () => {
    vi.mocked(existsSync).mockImplementation((file) =>
      String(file).endsWith('theme.css')
    )
    expect(getOrganizationTheme({ theme: 'utrecht' })).toBe('default')
  })

  it('falls back when organization CSS has not been built', () => {
    vi.mocked(existsSync).mockImplementation((file) =>
      String(file).endsWith('.json')
    )
    expect(getOrganizationTheme({ theme: 'brabant' })).toBe('default')
  })

  it('rejects unsafe theme paths', () => {
    expect(getOrganizationTheme({ theme: '../../private' })).toBe('default')
    expect(existsSync).not.toHaveBeenCalled()
  })
})
