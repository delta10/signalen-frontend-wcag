import { useEffect, useMemo, useState } from 'react'
import {
  Layer,
  Source,
  useMap,
  type LayerProps,
  type SourceProps,
} from 'react-map-gl/maplibre'
import type { MapLayerConfiguration } from '@/types/config'

type MapLayerProps = {
  layer: MapLayerConfiguration
}

const getLoadedIconsState = (layer: MapLayerConfiguration) =>
  // Track each configured icon so layers only render after all referenced icons
  // are registered in MapLibre.
  Object.fromEntries(layer.icons?.map((icon) => [icon.id, false]) ?? [])

export const MapLayer = ({ layer }: MapLayerProps) => {
  const { dialogMap } = useMap()
  const [loadedIcons, setLoadedIcons] = useState<Record<string, boolean>>(() =>
    getLoadedIconsState(layer)
  )

  useEffect(() => {
    if (!dialogMap || !layer.icons?.length) return

    // Image loading is async, so prevent late callbacks from updating state
    // after this layer has unmounted.
    let isActive = true

    const images = layer.icons.map((icon) => {
      const image = new Image(icon.width, icon.height)

      const addImage = () => {
        if (!isActive) return
        if (!image.complete) return

        // MapLibre can drop custom images after a style reload. Re-add the
        // icon when needed, while hasImage prevents duplicate registration.
        if (!dialogMap.hasImage(icon.id)) {
          dialogMap.addImage(icon.id, image)
        }

        setLoadedIcons((current) => ({ ...current, [icon.id]: true }))
      }

      image.onload = addImage
      image.src = icon.url
      // Re-register custom icons after MapLibre style changes.
      dialogMap.on('styledata', addImage)

      return { addImage }
    })

    return () => {
      isActive = false

      images.forEach(({ addImage }) => {
        dialogMap.off('styledata', addImage)
      })
    }
  }, [dialogMap, layer.icons])

  const areIconsLoaded = useMemo(
    () =>
      !layer.icons?.length || layer.icons.every((icon) => loadedIcons[icon.id]),
    [layer.icons, loadedIcons]
  )

  if (!areIconsLoaded) {
    // Symbol layers that reference an icon need that icon to exist first.
    return null
  }

  const sourceProps = {
    id: layer.id,
    ...layer.source,
  } as SourceProps

  return (
    <Source {...sourceProps}>
      {layer.layers.map(({ sourceLayer, ...configuredLayer }) => {
        // The config uses sourceLayer for TypeScript-friendly naming, while
        // MapLibre expects the style spec key source-layer.
        const layerProps = {
          ...configuredLayer,
          ...(sourceLayer ? { 'source-layer': sourceLayer } : {}),
        } as LayerProps

        return <Layer key={configuredLayer.id} {...layerProps} />
      })}
    </Source>
  )
}
