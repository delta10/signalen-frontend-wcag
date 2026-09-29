import { useEffect, useMemo } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { useConfig } from '@/contexts/ConfigContext'
import { MapLayer } from '@/app/[locale]/incident/add/components/MapLayer'

export const MapLayers = () => {
  const config = useConfig()
  const { dialogMap } = useMap()
  const hectometerSourceLayerId =
    config.base.pdok_hectometer_suggest?.sourceLayerId
  const layers = useMemo(() => {
    const configuredLayers = config.base.map.layers ?? []

    return configuredLayers.map((layer) => {
      if (
        layer.id !== hectometerSourceLayerId ||
        layer.source.type !== 'geojson'
      ) {
        return layer
      }

      return {
        ...layer,
        source: {
          ...layer.source,
          data: `/api/hectometers?sourceLayerId=${encodeURIComponent(layer.id)}&validatedSource=true`,
        },
      }
    })
  }, [config.base.map.layers, hectometerSourceLayerId])
  const symbolLayerIds = useMemo(
    () =>
      layers.flatMap((layer) =>
        layer.layers
          .filter((configuredLayer) => configuredLayer.type === 'symbol')
          .map((configuredLayer) => configuredLayer.id)
      ),
    [layers]
  )

  useEffect(() => {
    if (!dialogMap || symbolLayerIds.length === 0) return

    const moveSymbolLayersToTop = () => {
      const styleLayerIds =
        dialogMap.getStyle()?.layers?.map((styleLayer) => styleLayer.id) ?? []
      const existingSymbolLayerIds = symbolLayerIds.filter((id) =>
        styleLayerIds.includes(id)
      )

      if (existingSymbolLayerIds.length === 0) return

      const currentTopLayerIds = styleLayerIds.slice(
        -existingSymbolLayerIds.length
      )
      const alreadyOnTop = existingSymbolLayerIds.every(
        (id, index) => currentTopLayerIds[index] === id
      )

      if (!alreadyOnTop) {
        existingSymbolLayerIds.forEach((id) => dialogMap.moveLayer(id))
      }
    }

    moveSymbolLayersToTop()
    dialogMap.on('styledata', moveSymbolLayersToTop)

    return () => {
      dialogMap.off('styledata', moveSymbolLayersToTop)
    }
  }, [dialogMap, symbolLayerIds])

  return layers.map((layer) => <MapLayer key={layer.id} layer={layer} />)
}
