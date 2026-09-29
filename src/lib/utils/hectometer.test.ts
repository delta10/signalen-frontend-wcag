import { describe, expect, it } from 'vitest'
import type { FeatureCollection, Point } from 'geojson'

import {
  filterProvincialHectometerPosts,
  filterValidProvincialHectometerFeatures,
  findNearestProvincialHectometerPost,
  isValidHectometerDisplayName,
} from '@/lib/utils/hectometer'

const source: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'invalid-a270',
      geometry: { type: 'Point', coordinates: [5, 51] },
      properties: { WEG_NR: 'A270', TEKST: '5.34547' },
    },
    {
      type: 'Feature',
      id: 'n270',
      geometry: { type: 'Point', coordinates: [5.0001, 51] },
      properties: { WEG_NR: 'N270', TEKST: '19.0' },
    },
    {
      type: 'Feature',
      id: 'a270',
      geometry: { type: 'Point', coordinates: [5.001, 51] },
      properties: { WEG_NR: 'A270', TEKST: '5.5' },
    },
  ],
}

describe('hectometer utilities', () => {
  it('keeps A270 and N270 as distinct road numbers', () => {
    expect(filterProvincialHectometerPosts(source, 'N270', 10)).toHaveLength(1)
    expect(
      filterProvincialHectometerPosts(source, 'N270', 10)[0].weergave_naam
    ).toBe('Hectometerpaal N270-19.0')
    expect(
      filterProvincialHectometerPosts(source, 'A270', 10)[0].weergave_naam
    ).toBe('Hectometerpaal A270-5.5')
  })

  it('ignores an invalid closer value when selecting the nearest post', () => {
    const result = findNearestProvincialHectometerPost(source, 51, 5, 60)

    expect(result?.weergave_naam).toBe('Hectometerpaal N270-19.0')
  })

  it('uses the same validation before rendering the map layer', () => {
    const result = filterValidProvincialHectometerFeatures(source)

    expect(result.features.map((feature) => feature.id)).toEqual([
      'n270',
      'a270',
    ])
  })

  it('rejects invalid reverse-search display names', () => {
    expect(isValidHectometerDisplayName('Hectometerpaal A270-5.34547')).toBe(
      false
    )
    expect(isValidHectometerDisplayName('Hectometerpaal N269-95')).toBe(true)
  })
})
