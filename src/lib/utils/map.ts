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
