import { FeatureType } from '@/types/form'
import { GeoJsonProperties } from 'geojson'
import {
  isTemplateString,
  parseTemplateString,
} from '@/lib/utils/parseTemplateString'
import { useConfig } from '@/contexts/ConfigContext'

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

/**
 * Processes a GeoJSON feature and returns all relevant metadata in a single pass.
 *
 * This function optimizes performance by doing all feature type matching, filtering,
 * and data extraction in one operation instead of multiple separate calls.
 *
 * @param featureTypes - Array of available feature type definitions
 * @param properties - GeoJSON properties object from the feature
 *
 * @returns Object containing:
 *   - featureType: The matched FeatureType or fallback type, null if no valid types found
 *   - iconUrl: URL of the icon for this feature type, null if no type found
 *   - description: Processed description with template variables replaced, null if no type found
 *   - id: The feature's ID extracted from the properties using the featureType's idField
 *
 * @example
 * ```typescript
 * const result = processFeature(
 *   [
 *     {
 *       idField: "container_nummer",
 *       typeField: "soort",
 *       typeValue: "Glas",
 *       label: "Glass Container",
 *       icon: { iconUrl: "/glass.svg" },
 *       description: "Container {{locatie_omschrijving}}"
 *     }
 *   ],
 *   {
 *     container_nummer: "GS12D",
 *     soort: "Glas",
 *     locatie_omschrijving: "Hoofdstraat"
 *   }
 * );
 * // Returns: {
 * //   featureType: { ... },
 * //   iconUrl: "/glass.svg",
 * //   description: "Glasbak",
 * //   id: "GS12D"
 * // }
 * ```
 */
export const processFeature = (
  featureTypes: FeatureType[],
  properties: GeoJsonProperties
): {
  featureType: FeatureType | null
  iconUrl: string | null
  description: string | null
  label: string | null
  id: string | number | undefined
} | null => {
  if (!properties) {
    return null
  }

  const selectedFeatureType = getFeatureType(properties, featureTypes)

  if (!selectedFeatureType) {
    return null
  }

  // Get feature ID
  const featureId = properties[selectedFeatureType.idField] || null
  // Get description and label
  let description: string | null = null
  let label: string | null = null
  let replacementValue: string | null = null
  if (selectedFeatureType) {
    if (!selectedFeatureType.description) {
      description = `${selectedFeatureType.label}`
      label = `${description} - ${featureId}`
    } else {
      const match = selectedFeatureType.description.match(/{{(.*?)}}/)
      const propertyToReplace = match ? match[0] : null
      const propertyInProperties = match ? match[1] : null

      if (propertyToReplace && propertyInProperties) {
        replacementValue = properties[propertyInProperties.trim()]

        description = isTemplateString(selectedFeatureType.description)
          ? selectedFeatureType.description?.split('-')[0].trim()
          : description

        label = isTemplateString(selectedFeatureType.description)
          ? parseTemplateString(selectedFeatureType.description, properties)
          : `${selectedFeatureType.description} - ${featureId}`
      } else {
        description = `${selectedFeatureType.description}`
        label = `${selectedFeatureType.description} - ${featureId}`
      }
    }
  }

  return {
    featureType: selectedFeatureType,
    iconUrl: selectedFeatureType?.icon.iconUrl || null,
    description: description,
    label: label,
    // Overwrite the id with the replacement value, when this is available it contains the attribute number of the feature which is more relevant than then given id.
    id: replacementValue ? replacementValue : featureId,
  }
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

/**
 * Returns the appropriate MapTiler style URL based on the current theme.
 *
 * @param isDarkMode - Boolean flag indicating if dark mode is active.
 * @returns A full MapTiler style URL with the appropriate theme and API key.
 */
export const getMapStyleUrl = (isDarkMode: boolean): string => {
  const config = useConfig()
  const baseUrl = isDarkMode
    ? config?.maptilerMapDarkMode
    : config?.maptilerMap

  return `${baseUrl}/style.json?key=${config?.maptilerApiKey}`
}

const getFeatureType = (
  properties: GeoJsonProperties,
  featureTypes: FeatureType[]
) =>
  featureTypes.find(({ typeField, typeValue }) => {
    return properties?.[typeField] === typeValue
  })
