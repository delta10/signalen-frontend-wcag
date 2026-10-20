import { useEffect, useState } from 'react'
import type { FeatureCollection } from 'geojson'
import { useConfig } from '@/contexts/ConfigContext'
import type { MapLayerConfiguration } from '@/types/config'
import { isHectometerNotation } from '@/lib/utils/hectometer'
import { MapLayer } from '@/app/[locale]/incident/add/components/MapLayer'

const HectometerLayer = ({ layer }: { layer: MapLayerConfiguration }) => {
  const [data, setData] = useState<FeatureCollection | null>(null)
  const sourceUrl = layer.source.data as string

  useEffect(() => {
    const controller = new AbortController()
    fetch(sourceUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Could not fetch hectometer layer.')
        return response.json() as Promise<FeatureCollection>
      })
      .then((source) => {
        if (!controller.signal.aborted) {
          setData({
            ...source,
            features: source.features.filter((feature) =>
              isHectometerNotation(String(feature.properties?.TEKST ?? ''))
            ),
          })
        }
      })
      .catch(() => {
        /* Hide the layer when its source cannot be loaded. */
      })

    return () => controller.abort()
  }, [sourceUrl])

  return data ? (
    <MapLayer layer={{ ...layer, source: { ...layer.source, data } }} />
  ) : null
}

export const MapLayers = () => {
  const config = useConfig()
  return (config.base.map.layers ?? []).map((layer) =>
    layer.id === 'hectometrering' &&
    layer.source.type === 'geojson' &&
    typeof layer.source.data === 'string' ? (
      <HectometerLayer key={layer.source.data} layer={layer} />
    ) : (
      <MapLayer key={layer.id} layer={layer} />
    )
  )
}
