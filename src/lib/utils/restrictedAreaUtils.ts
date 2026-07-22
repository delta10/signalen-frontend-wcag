import { LayerProps, MapRef } from 'react-map-gl/maplibre'
import { VectorTile } from '@mapbox/vector-tile'
import { point as turfPoint } from '@turf/helpers'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { PbfReader } from 'pbf'
import { AppConfig } from '@/types/config'
import { Address } from '@/types/form'
import { Feature, MultiPolygon, Polygon } from 'geojson'

/** Source id used by the MapLibre source that renders the restricted area. */
export const OUT_OF_BOUNDS_SOURCE_ID = 'out-of-bounds-source'
const OUT_OF_BOUNDS_LINE_ID = 'restricted-corridor-line'

type TileJson = {
  maxzoom?: number
  tiles?: string[]
}

const tileJsonCache = new Map<string, Promise<TileJson>>()
const vectorTileCache = new Map<string, Promise<ArrayBuffer>>()

/**
 * Returns the line layer style used to outline the restricted-area mask.
 *
 * @param config - Application configuration containing the MapTiler layer id.
 * @returns A MapLibre line layer style for the configured restriction source.
 */
export const outOfBoundsLineStyleObject = (config: AppConfig): LayerProps => {
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

/**
 * Returns the fill layer style for the mask that represents restricted areas.
 *
 * @param config - Application configuration containing the MapTiler layer id.
 * @returns A MapLibre fill layer style for the configured restriction source.
 */
export const outOfBoundsFillStyleObject = (config: AppConfig): LayerProps => {
  return {
    id: OUT_OF_BOUNDS_SOURCE_ID,
    type: 'fill',
    source: OUT_OF_BOUNDS_SOURCE_ID,
    'source-layer': config.maptilerOutOfBoundsLayerId,
    paint: {
      'fill-color': '#858383',
      'fill-opacity': 0.6,
    },
  }
}

const isPointInOutOfBoundsFeatures = (
  features: Array<Feature<Polygon | MultiPolygon>>,
  lng: number,
  lat: number
) => {
  const point = turfPoint([lng, lat])

  return features.some((feature) => booleanPointInPolygon(point, feature))
}

/**
 * Checks whether a map-click coordinate is inside an out-of-bounds polygon that
 * is already loaded in the visible MapLibre map source.
 *
 * @remarks
 * This is intended for map clicks only. A click happens inside the current
 * viewport, so MapLibre has normally loaded the vector tile that contains the
 * relevant restriction polygons. Combobox selections can point outside the
 * current viewport and therefore use {@link isAddressOutsideRestrictedArea}
 * instead.
 *
 * @param config - Application configuration containing the MapTiler layer id.
 * @param map - The visible MapLibre map instance that contains the source.
 * @param lng - Longitude of the selected point.
 * @param lat - Latitude of the selected point.
 * @returns `true` when the point falls inside an out-of-bounds polygon.
 */
export const isPointOutsideRestrictedArea = (
  config: AppConfig,
  map: MapRef | undefined,
  lng: number,
  lat: number
): boolean => {
  if (!map) return false

  const point = turfPoint([lng, lat])

  const sourceFeatures = map.querySourceFeatures(OUT_OF_BOUNDS_SOURCE_ID, {
    sourceLayer: config.maptilerOutOfBoundsLayerId,
  })

  return sourceFeatures.some((feature) => {
    if (feature.type !== 'Feature' || !feature.geometry) {
      return false
    }

    const { type } = feature.geometry
    const isPolygonType = type === 'Polygon' || type === 'MultiPolygon'

    return (
      isPolygonType &&
      booleanPointInPolygon(point, feature as Feature<Polygon | MultiPolygon>)
    )
  })
}

/**
 * Fetches and caches the TileJSON metadata for the configured MapTiler vector
 * source. The metadata contains the tile URL template and supported zoom range.
 *
 * @param url - TileJSON URL from `maptilerOutOfBoundsSelectionArea`.
 * @returns A promise resolving to the TileJSON metadata.
 */
const fetchTileJson = (url: string) => {
  if (!tileJsonCache.has(url)) {
    tileJsonCache.set(
      url,
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch restricted area TileJSON.')
        }

        return response.json() as Promise<TileJson>
      })
    )
  }

  return tileJsonCache.get(url)!
}

/**
 * Fetches and caches a vector tile PBF by URL. Tile requests are cached because
 * nearby hectometer suggestions often resolve to the same vector tile.
 *
 * @param url - Concrete PBF tile URL.
 * @returns A promise resolving to the raw PBF tile bytes.
 */
const fetchVectorTile = (url: string) => {
  if (!vectorTileCache.has(url)) {
    vectorTileCache.set(
      url,
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error('Could not fetch restricted area vector tile.')
        }

        return response.arrayBuffer()
      })
    )
  }

  return vectorTileCache.get(url)!
}

/**
 * Converts longitude to the x index of a Web Mercator tile at the given zoom.
 *
 * @param lng - Longitude in WGS84 degrees.
 * @param zoom - Web Mercator tile zoom level.
 * @returns The x tile index containing the longitude.
 */
const longitudeToTileX = (lng: number, zoom: number) => {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom)
}

/**
 * Converts latitude to the y index of a Web Mercator tile at the given zoom.
 *
 * @param lat - Latitude in WGS84 degrees.
 * @param zoom - Web Mercator tile zoom level.
 * @returns The y tile index containing the latitude.
 */
const latitudeToTileY = (lat: number, zoom: number) => {
  const latRad = (lat * Math.PI) / 180

  return Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      2 ** zoom
  )
}

/**
 * Expands a TileJSON URL template into the concrete PBF URL for one tile.
 *
 * @param tileJson - TileJSON metadata containing a `{z}/{x}/{y}` tile template.
 * @param zoom - Tile zoom level.
 * @param x - Tile x index.
 * @param y - Tile y index.
 * @returns The concrete vector tile URL.
 */
const getTileUrl = (tileJson: TileJson, zoom: number, x: number, y: number) => {
  const template = tileJson.tiles?.[0]

  if (!template) {
    throw new Error('Restricted area TileJSON does not contain tile URLs.')
  }

  return template
    .replace('{z}', String(zoom))
    .replace('{x}', String(x))
    .replace('{y}', String(y))
}

/**
 * Loads the vector tile covering the coordinate and returns polygon features
 * from the configured out-of-bounds layer as GeoJSON.
 *
 * @remarks
 * MapTiler serves the restricted area as vector tiles. To validate a combobox
 * selection without moving the visible map, this function calculates which tile
 * contains the selected coordinate, fetches that tile, decodes the configured
 * source layer, and converts polygon features back to GeoJSON.
 *
 * @param config - Application configuration containing the TileJSON URL and layer id.
 * @param lng - Longitude of the selected point.
 * @param lat - Latitude of the selected point.
 * @returns Polygon features from the out-of-bounds layer for the containing tile.
 */
const getRestrictedAreaFeatures = async (
  config: AppConfig,
  lng: number,
  lat: number
) => {
  if (!config.maptilerOutOfBoundsSelectionArea) {
    return []
  }

  const tileJson = await fetchTileJson(config.maptilerOutOfBoundsSelectionArea)
  const zoom = tileJson.maxzoom ?? 14
  const x = longitudeToTileX(lng, zoom)
  const y = latitudeToTileY(lat, zoom)
  const tileUrl = getTileUrl(tileJson, zoom, x, y)
  const tileBuffer = await fetchVectorTile(tileUrl)
  const tile = new VectorTile(new PbfReader(tileBuffer))
  const layerId = config.maptilerOutOfBoundsLayerId

  if (!layerId) {
    return []
  }

  const layer = tile.layers[layerId]

  if (!layer) {
    return []
  }

  const features: Array<Feature<Polygon | MultiPolygon>> = []

  for (let index = 0; index < layer.length; index += 1) {
    const feature = layer.feature(index).toGeoJSON(x, y, zoom)

    if (
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
    ) {
      features.push(feature as Feature<Polygon | MultiPolygon>)
    }
  }

  return features
}

/**
 * Checks whether a selected address/hectometer falls in the configured
 * out-of-bounds area without moving the visible map.
 *
 * @remarks
 * This is used for combobox selections, where the selected coordinate can be in
 * a tile that is not loaded by the visible map yet. Validation is done directly
 * against the MapTiler vector tile data instead of calling `flyTo` or `jumpTo`
 * on the visible map.
 *
 * If the restriction tile cannot be fetched or decoded, validation fails closed:
 * the selection is treated as outside the allowed area.
 *
 * @param config - Application configuration containing restriction settings.
 * @param address - Selected address or hectometer with `[lng, lat]` coordinates.
 * @returns `true` when the selected coordinate is outside the allowed area.
 */
export const isAddressOutsideRestrictedArea = async (
  config: AppConfig,
  address: Address
): Promise<boolean> => {
  if (!config.restrictSelectionArea) {
    return false
  }

  const [lng, lat] = address.coordinates

  try {
    const features = await getRestrictedAreaFeatures(config, lng, lat)

    return isPointInOutOfBoundsFeatures(features, lng, lat)
  } catch {
    return true
  }
}
