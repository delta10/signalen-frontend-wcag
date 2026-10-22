import { describe, expect, it } from 'vitest'
import {
  formatHectometerDisplayName,
  isHectometerNotation,
  isValidHectometerDisplayName,
} from './hectometer'

describe('hectometer validation', () => {
  it('accepts PDOK numbers and map labels, including hectometer letters', () => {
    expect(isValidHectometerDisplayName('Hectometerpaal N269-95')).toBe(true)
    expect(isValidHectometerDisplayName('Hectometerpaal A270-5.5')).toBe(true)
    expect(isValidHectometerDisplayName('Hectometerpaal N270-12.3a')).toBe(true)
    expect(isHectometerNotation('12.3a')).toBe(true)
    expect(isValidHectometerDisplayName('Hectometerpaal N270-239a')).toBe(true)
    expect(formatHectometerDisplayName('Hectometerpaal N270-239a')).toBe(
      'Hectometerpaal N270-23.9a'
    )
    expect(formatHectometerDisplayName('Hectometerpaal N1-5')).toBe(
      'Hectometerpaal N1-0.5'
    )
  })

  it('rejects calculated values that do not represent real post numbers', () => {
    expect(isValidHectometerDisplayName('Hectometerpaal A270-5.34547')).toBe(
      false
    )
    expect(isHectometerNotation('5.34547')).toBe(false)
    expect(isHectometerNotation('')).toBe(false)
  })
})
