import type { FeatureCollection } from 'geojson'
import type { Address } from '@/types/form'

type ProvincialHectometerProperties = {
  TEKST?: unknown
  WEG_NR?: unknown
}

const EARTH_RADIUS_METERS = 6_371_000

const normalizeHectometerValue = (value: string) =>
  value.toLocaleUpperCase('nl-NL').replace(/[^A-Z0-9]/g, '')

export const formatHectometerDisplayName = (displayName: string) =>
  displayName.replace(/-(\d+)(\d)$/, '-$1.$2')

export const isHectometerNotation = (value: string) =>
  /^\d+\.\d[a-z]?$/.test(value.toLocaleLowerCase('nl-NL'))

/** Checks the hectometer part of a complete PDOK display name. */
export const isValidHectometerDisplayName = (displayName: string) => {
  const formattedDisplayName = formatHectometerDisplayName(displayName)
  const hectometerNumber = formattedDisplayName.match(/-([^-]+)$/)?.[1]

  return Boolean(hectometerNumber && isHectometerNotation(hectometerNumber))
}

const toRadians = (value: number) => (value * Math.PI) / 180

const getDistanceInMeters = (
  first: [number, number],
  second: [number, number]
) => {
  const [firstLng, firstLat] = first
  const [secondLng, secondLat] = second
  const latitudeDifference = toRadians(secondLat - firstLat)
  const longitudeDifference = toRadians(secondLng - firstLng)
  const firstLatitude = toRadians(firstLat)
  const secondLatitude = toRadians(secondLat)
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  )
}

const mapProvincialHectometerFeatureToAddress = (
  feature: FeatureCollection['features'][number]
): Address | null => {
  const properties = feature.properties as ProvincialHectometerProperties
  const hectometerNumber = properties?.TEKST
  const roadNumber = properties?.WEG_NR

  if (
    typeof hectometerNumber !== 'string' ||
    typeof roadNumber !== 'string' ||
    !isHectometerNotation(hectometerNumber) ||
    feature.geometry?.type !== 'Point'
  ) {
    return null
  }

  const [lng, lat] = feature.geometry.coordinates

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return null
  }

  const displayName = `Hectometerpaal ${roadNumber}-${hectometerNumber}`

  return {
    coordinates: [lng, lat],
    id: `hmp-provincial-${feature.id ?? `${displayName}-${lng}-${lat}`}`,
    postcode: '',
    huisnummer: '',
    woonplaats: '',
    openbare_ruimte: displayName,
    weergave_naam: displayName,
  }
}

/** Maps valid provincial features once, retaining their original map geometry. */
export const getProvincialHectometers = (source: FeatureCollection) =>
  source.features.flatMap((feature) => {
    const address = mapProvincialHectometerFeatureToAddress(feature)
    return address ? [{ feature, address }] : []
  })

/** Searches the prepared provincial posts, sorting before applying the limit. */
export const filterProvincialHectometerPosts = (
  posts: Address[],
  searchQuery: string,
  maxResults: number
): Address[] => {
  const normalizedQuery = normalizeHectometerValue(searchQuery)

  if (!normalizedQuery) {
    return []
  }

  return posts
    .filter((address) =>
      normalizeHectometerValue(address.weergave_naam ?? '').includes(
        normalizedQuery
      )
    )
    .sort((first, second) =>
      (first.weergave_naam ?? '').localeCompare(
        second.weergave_naam ?? '',
        'nl-NL',
        { numeric: true }
      )
    )
    .slice(0, Math.max(0, maxResults))
}

/** Finds the nearest valid post in the authoritative provincial layer. */
export const findNearestProvincialHectometerPost = (
  posts: Address[],
  lat: number,
  lng: number,
  maxDistance: number
): Address | null => {
  let nearestAddress: Address | null = null
  let nearestDistance = maxDistance

  posts.forEach((address) => {
    const [addressLng, addressLat] = address.coordinates
    const distance = getDistanceInMeters([lng, lat], [addressLng, addressLat])

    if (distance <= nearestDistance) {
      nearestAddress = address
      nearestDistance = distance
    }
  })

  return nearestAddress
}
