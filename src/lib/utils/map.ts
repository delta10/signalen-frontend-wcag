import { FeatureType } from '@/types/form'
import { GeoJsonProperties } from 'geojson'

export const isCoordinates = (arg: unknown): arg is [number, number] => {
  return (
    Array.isArray(arg) &&
    arg.length === 2 &&
    typeof arg[0] === 'number' &&
    typeof arg[1] === 'number'
  )
}

export const isCoordinateInsideMaxBound = (
  lat: number,
  lng: number,
  maxBounds: [[number, number], [number, number]]
): boolean => {
  const [minLng, minLat] = maxBounds[0]
  const [maxLng, maxLat] = maxBounds[1]

  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng
}

// This function takes a GeoJsonProperties object and a featureType object (which is a field.meta AssetSelect question in Signalen) and returns either null or a formatted string.
// The purpose is to match a feature with its corresponding featureType, as an AssetSelect question can have multiple featureTypes.
// This ensures that the correct icon, title, and other details are displayed.
export const getFeatureType = (
  featureType: FeatureType[],
  properties: GeoJsonProperties
): FeatureType | null => {
  if (properties) {
    const featureTypes = featureType.filter((feature: FeatureType) =>
      properties.hasOwnProperty(feature.idField)
    )

    if (featureTypes.length) return featureTypes[0]
  }

  return null
}

// This function takes in a GeoJsonProperties object and a featureType object (which is a field.meta AssetSelect question in Signalen) and returns either null or a formatted string.
// The featureType object usually contains a property called description, which might look like "Mastverlichting - {{ nummer }}", for example.
// In the properties field of the GeoJsonProperties object, there is then a corresponding property, such as "Nummer", with a value like "308".
// If these conditions are met, the function will return the string "Mastverlichting - 308".
export const getFeatureDescription = (
  featureType: FeatureType | null,
  properties: GeoJsonProperties
): string | null => {
  if (properties && featureType) {
    const match = featureType.description.match(/{{(.*?)}}/)

    const propertyToReplace = match ? match[0] : null
    const propertyInProperties = match ? match[1] : null

    if (propertyToReplace && propertyInProperties) {
      const string: string = properties[propertyInProperties.trim()]

      return string
        ? featureType.description.replace(propertyToReplace, string)
        : null
    }

    return null
  }

  return null
}

// This function returns the feature id of a feature
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

// This function formats a given "PDOK weergavenaam" into a object with seperate postal code, huisnummer, openbare_ruimte (street name) and woonplaats
export const formatAddressToSignalenInput = (input: string) => {
  if (input === '') {
    return {}
  }

  // Split the main components by ","
  const [streetAndNumber, postcodeAndCity] = input
    .split(',')
    .map((part) => part.trim())

  // Extract street and house number
  const streetMatch = streetAndNumber.match(/(.+)\s(\d+)$/) // Matches "N.C.B.-laan" and "17"
  const openbare_ruimte = streetMatch ? streetMatch[1] : null
  const huisnummer = streetMatch ? streetMatch[2] : null

  // Extract postal code and city
  const postcodeMatch = postcodeAndCity.match(/^([0-9A-Z]+)\s(.+)$/) // Matches "5462GA" and "Veghel"
  const postcode = postcodeMatch ? postcodeMatch[1] : null
  const woonplaats = postcodeMatch ? postcodeMatch[2] : null

  return {
    huisnummer,
    openbare_ruimte,
    postcode,
    woonplaats,
  }
}
