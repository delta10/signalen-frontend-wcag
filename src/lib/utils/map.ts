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

// This function was created to address uncertainty regarding the presence of an `ID` field in every random GeoJSON feature that Signalen renders.
// While the existence of an `ID` field is not guaranteed, we can reliably assume that every feature includes a `geometry` field
// with associated coordinates. By building this function, we ensure consistent handling of GeoJSON features without depending on an `ID` field.
export const getFeatureIdByCoordinates = (
  coordinates: [number, number]
): number => {
  return coordinates.reduce((first, second) => first + second)
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
