import { FeatureType } from '@/types/form'
import { GeoJsonProperties } from 'geojson'

// Validates if the argument is a coordinate pair [longitude, latitude]
// @param {unknown} arg - Input to validate
// @returns {arg is [number, number]} - Type predicate for coordinate tuple
export const isCoordinates = (arg: unknown): arg is [number, number] => {
  return (
    Array.isArray(arg) &&
    arg.length === 2 &&
    typeof arg[0] === 'number' &&
    typeof arg[1] === 'number'
  )
}

// Checks if coordinates are within specified geographical bounds
// @param {number} lat - Latitude to check
// @param {number} lng - Longitude to check
// @param {[[number, number], [number, number]]} maxBounds - Geographical boundary coordinates
// @returns {boolean} - Whether coordinates are inside bounds
export const isCoordinateInsideMaxBound = (
  lat: number,
  lng: number,
  maxBounds: number[][]
): boolean => {
  const [minLng, minLat] = maxBounds[0]
  const [maxLng, maxLat] = maxBounds[1]

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

// todo kijk of dit slimmer kan, denk dat we alles wel in een keer kunnen ophalen
// Matches a GeoJSON feature with its corresponding feature type
// @param {FeatureType[]} featureType - Array of possible feature types
// @param {GeoJsonProperties} properties - Properties of the GeoJSON feature
// @returns {FeatureType | null} - Matching feature type or null
export const getFeatureType = (
  featureType: FeatureType[],
  properties: GeoJsonProperties
): FeatureType | null => {
  if (properties) {
    const featureTypes = featureType.filter((feature: FeatureType) =>
      properties.hasOwnProperty(feature.idField)
    )
    const matchedType = featureTypes.find(
      (featureType) =>
        featureType.typeField &&
        properties[featureType.typeField] === featureType.typeValue
    )
    // If no match found, return the last element (fallback)
    return matchedType || featureTypes[featureTypes.length - 1]
  }

  return null
}

// todo: invullen
// @param {FeatureType[]} featureType - Array of possible feature types
// @param {GeoJsonProperties} properties - Properties of the GeoJSON feature
// @returns {FeatureType | null} - Matching feature type or null
export const getFeatureIconUrl = (
  featureType: FeatureType[],
  properties: GeoJsonProperties
): string | null => {
  if (properties) {
    const featureTypes = featureType.filter((feature: FeatureType) =>
      properties.hasOwnProperty(feature.idField)
    )
    const matchedType = featureTypes.find(
      (featureType) =>
        featureType.typeField &&
        properties[featureType.typeField] === featureType.typeValue
    )
    const feature = matchedType || featureTypes[featureTypes.length - 1]
    return feature.icon.iconUrl
  }

  return null
}

// Generates a human-readable description for a geographic feature
// @param {FeatureType | null} featureType - Feature type definition
// @param {GeoJsonProperties} properties - Feature properties
// @returns {string | null} - Formatted feature description
export const getFeatureDescription = (
  featureType: FeatureType | null,
  properties: GeoJsonProperties
): string | null => {
  if (properties && featureType) {
    // If there is no description, use the label and the feature ID
    if (!featureType.description) {
      return `${featureType.label} - ${getFeatureId(featureType, properties)}`
    }

    const match = featureType.description?.match(/{{(.*?)}}/)

    const propertyToReplace = match ? match[0] : null
    const propertyInProperties = match ? match[1] : null

    if (propertyToReplace && propertyInProperties) {
      const string: string = properties[propertyInProperties.trim()]

      return string
        ? featureType.description.replace(propertyToReplace, string)
        : `${featureType.description} - ${getFeatureId(featureType, properties)}`
    }

    return `${featureType.description} - ${getFeatureId(featureType, properties)}`
  }

  return null
}

// Extracts the unique identifier for a geographic feature
// @param {FeatureType | null} featureType - Feature type definition
// @param {GeoJsonProperties} properties - Feature properties
// @returns {number | undefined} - Feature ID or undefined
export const getFeatureId = (
  featureType: FeatureType | null,
  properties: GeoJsonProperties
): number | undefined => {
  if (featureType) {
    const idField = featureType.idField || null

    if (idField && properties && properties[idField]) {
      return properties[idField]
    }

    return undefined
  }

  return undefined
}

// Parses a PDOK address format into separate components
// @param {string} input - Full address string
// @returns {Object} - Parsed address components
export const formatAddressToSignalenInput = (
  input: string
): {
  huisnummer?: string | null
  openbare_ruimte?: string | null
  postcode?: string | null
  woonplaats?: string | null
} => {
  if (input === '') {
    return {}
  }

  const [streetAndNumber, postcodeAndCity] = input
    .split(',')
    .map((part) => part.trim())

  const streetMatch = streetAndNumber.match(/(.+)\s(\d+)$/)
  const openbare_ruimte = streetMatch ? streetMatch[1] : null
  const huisnummer = streetMatch ? streetMatch[2] : null

  const postcodeMatch = postcodeAndCity.match(/^([0-9A-Z]+)\s(.+)$/)
  const postcode = postcodeMatch ? postcodeMatch[1] : null
  const woonplaats = postcodeMatch ? postcodeMatch[2] : null

  return {
    huisnummer,
    openbare_ruimte,
    postcode,
    woonplaats,
  }
}

// utils/map/getMapStyle.ts

/**
 * Returns the appropriate MapTiler style URL based on the current theme.
 *
 * @param isDarkMode - Boolean flag indicating if dark mode is active.
 * @returns A full MapTiler style URL with the appropriate theme and API key.
 */
export const getMapStyleUrl = (isDarkMode: boolean): string => {
  const baseUrl = isDarkMode
    ? process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE
    : process.env.NEXT_PUBLIC_MAPTILER_MAP

  return `${baseUrl}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
}
