import { MapRef } from 'react-map-gl/maplibre'
import { point as turfPoint } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { AppConfig } from '@/types/config'

// Source ids
export const OUT_OF_BOUNDS_SOURCE_ID = 'out-of-bounds-source'
const OUT_OF_BOUNDS_LINE_ID = 'restricted-corridor-line'
const OUT_OF_BOUNDS_FILL_ID = 'out-of-bounds-area'

export const outOfBoundsLineStyleObject = (config: AppConfig) => {
  return {
    id: OUT_OF_BOUNDS_LINE_ID,
    type: 'line',
    source: OUT_OF_BOUNDS_SOURCE_ID,
    'source-layer': config.maptilerOutOfBoundsLayerId,
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 3],
      'line-opacity': 0.9,
    },
  }
}

// Mask fill (alles buiten corridor)
export const outOfBoundsFillStyleObject = (config: AppConfig) => {
  return {
    id: OUT_OF_BOUNDS_SOURCE_ID,
    type: 'fill',
    source: OUT_OF_BOUNDS_FILL_ID,
    'source-layer': config.maptilerOutOfBoundsLayerId,
    paint: {
      'fill-color': '#858383',
      'fill-opacity': 0.6,
    },
  }
}

export const isPointOutsideRestrictedArea = (
  config: AppConfig,
  dialogMap: MapRef | undefined,
  lng: number,
  lat: number
): boolean => {
  if (!dialogMap) return false

  const point = turfPoint([lng, lat])

  const sourceFeatures = dialogMap.querySourceFeatures(
    OUT_OF_BOUNDS_SOURCE_ID,
    {
      sourceLayer: config.maptilerOutOfBoundsLayerId,
    }
  )

  return sourceFeatures.some((feature) => {
    if (feature.type !== 'Feature' || !feature.geometry) {
      return false
    }

    const { type } = feature.geometry
    const isPolygonType = type === 'Polygon' || type === 'MultiPolygon'

    return isPolygonType && booleanPointInPolygon(point, feature as any)
  })
}
