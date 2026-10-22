import React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { ConfigProvider } from '@/contexts/ConfigContext'
import type { AppConfig, MapLayerConfiguration } from '@/types/config'
import { MapLayers } from './MapLayers'

vi.mock('@/app/[locale]/incident/add/components/MapLayer', () => ({
  MapLayer: ({ layer }: { layer: MapLayerConfiguration }) => (
    <pre data-testid={layer.id}>{JSON.stringify(layer.source.data)}</pre>
  ),
}))
afterEach(() => vi.unstubAllGlobals())

it('removes calculated hectometer labels while retaining valid posts and other map layers', async () => {
  const source = {
    type: 'FeatureCollection',
    features: ['5.34547', '5.5', '12.3a'].map((TEKST) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [5.5, 51.5] },
      properties: { TEKST },
    })),
  }
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, json: async () => source })
  )
  const config = {
    base: {
      map: {
        layers: [
          {
            id: 'hectometrering',
            source: { type: 'geojson', data: 'https://example.test/posts' },
            layers: [],
          },
          {
            id: 'roads',
            source: { type: 'geojson', data: 'https://example.test/roads' },
            layers: [],
          },
        ],
      },
    },
  } as unknown as AppConfig
  render(
    <ConfigProvider config={config}>
      <MapLayers />
    </ConfigProvider>
  )
  const filtered = JSON.parse(
    (await screen.findByTestId('hectometrering')).textContent!
  )
  expect(
    filtered.features.map(
      (feature: { properties: { TEKST: string } }) => feature.properties.TEKST
    )
  ).toEqual(['5.5', '12.3a'])
  expect(screen.getByTestId('roads')).toHaveTextContent(
    'https://example.test/roads'
  )
})
