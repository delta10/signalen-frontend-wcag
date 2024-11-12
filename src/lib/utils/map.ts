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
