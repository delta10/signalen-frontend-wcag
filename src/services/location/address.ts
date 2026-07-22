import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import {
  CoordinateResponse,
  SuggestResponse,
  HectometerSuggestDoc,
  AddressSuggestDoc,
  AddressCoordinateDoc,
  HectometerCoordinateDoc,
} from '@/types/pdok'
import {
  PdokAddressSuggestScope,
  pdokAddressSuggestFields,
} from '@/types/config'
import { FormStoreState } from '@/types/stores'
import type { CoordinateBounds } from '@/lib/utils/map'
import {
  getPointCoordinates,
  isCoordinateInsideMaxBound,
} from '@/lib/utils/map'

// Checks whether a hectometer post is inside configured longitude/latitude bounds.
// @param {HectometerSuggestDoc} doc - PDOK hectometer post suggestion document
// @param {CoordinateBounds} bounds - Optional bounds in [[minLng, minLat], [maxLng, maxLat]] format
// @returns {boolean} - True when no bounds are configured or the post is inside the bounds
const isHectometerWithinBounds = (
  doc: HectometerSuggestDoc,
  bounds?: CoordinateBounds
) => {
  if (!bounds) {
    return true
  }

  const coordinates = getPointCoordinates(doc.centroide_ll)

  if (!coordinates) {
    return false
  }

  const [lng, lat] = coordinates

  return isCoordinateInsideMaxBound(lat, lng, bounds)
}

// Creates a PDOK coordinate range filter. The application stores bounds as
// [longitude, latitude], while PDOK expects latitude,longitude in this filter.
const getHectometerBoundsFilter = (bounds?: CoordinateBounds) => {
  if (!bounds) {
    return null
  }

  const [[minLng, minLat], [maxLng, maxLat]] = bounds

  return `centroide_ll:[${minLat},${minLng} TO ${maxLat},${maxLng}]`
}

// Fetches suggested addresses from PDOK API based on search query and municipality or province
// @param {string} searchQuery - Text to search for addresses
// @param {PdokAddressSuggestScope} scope - `gemeente` → gemeentenaam filter, `provincie` → provincienaam
// @param {string} organization - PDOK gemeentenaam or provincienaam (see scope)
// @returns {Promise<SuggestResponse<AddressSuggestDoc>>} - Promise resolving to suggested addresses
// @throws {Error} - Throws an error if the request fails
export const getSuggestedAddresses = async (
  searchQuery: string,
  scope: PdokAddressSuggestScope,
  organization: string,
  pdokBaseUrl: string | undefined
): Promise<SuggestResponse<AddressSuggestDoc>> => {
  if (!pdokBaseUrl) {
    console.error('Pdok Base URL is required to fetch suggested addresses.')
    throw new Error('Pdok Base URL is required to fetch suggested addresses.')
  }
  const axios = axiosInstance(pdokBaseUrl)

  try {
    const field = pdokAddressSuggestFields[scope]
    const encodedOrganization = encodeURIComponent(organization)
    const encodedSearchQuery = encodeURIComponent(searchQuery)
    const path = `/search/v3_1/suggest?fq=${field}:(${encodedOrganization})&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll&fq=bron:BAG&fq=type:adres&q=${encodedSearchQuery}`
    const response: AxiosResponse<SuggestResponse<AddressSuggestDoc>> =
      await axios.get(path)

    return response.data
  } catch {
    throw new Error('Could not fetch suggested addresses. Please try again.')
  }
}

// Fetches suggested hectometer posts from PDOK Locatieserver.
// Hectometer posts are NWB records and do not support the BAG province filter,
// so optional coordinate bounds are used to restrict results to the configured instance area.
// @param {string} searchQuery - Text to search for hectometer posts, for example "A2 123"
// @param {string | undefined} pdokBaseUrl - Base URL for the PDOK Locatieserver API
// @param {CoordinateBounds} bounds - Optional longitude/latitude bounds used to filter results
// @param {string | undefined} roadNumberPrefix - Optional road number prefix, for example "N"
// @returns {Promise<SuggestResponse<HectometerSuggestDoc>>} - Promise resolving to suggested hectometer posts
// @throws {Error} - Throws an error if the request fails
export const getSuggestedHectometerPosts = async (
  searchQuery: string,
  pdokBaseUrl: string | undefined,
  bounds?: CoordinateBounds,
  roadNumberPrefix?: string
): Promise<SuggestResponse<HectometerSuggestDoc>> => {
  if (!pdokBaseUrl) {
    console.error('Pdok Base URL is required to fetch hectometer posts.')
    throw new Error('Pdok Base URL is required to fetch hectometer posts.')
  }

  const axios = axiosInstance(pdokBaseUrl)

  try {
    const encodedSearchQuery = encodeURIComponent(searchQuery)
    const boundsFilter = getHectometerBoundsFilter(bounds)
    const encodedBoundsFilter = boundsFilter
      ? `&fq=${encodeURIComponent(boundsFilter)}`
      : ''
    const encodedRoadNumberFilter = roadNumberPrefix
      ? `&fq=${encodeURIComponent(`wegnummer:${roadNumberPrefix}*`)}`
      : ''

    // Search only NWB hectometer posts. Apply configured bounds before PDOK's
    // default 10-result limit and restrict province-scoped searches to N-roads.
    const path = `/search/v3_1/suggest?fq=bron:NWB&fq=type:hectometerpaal${encodedBoundsFilter}${encodedRoadNumberFilter}&fl=id,identificatie,weergavenaam,centroide_ll,wegnummer,hectometernummer,hectometerletter&q=${encodedSearchQuery}`

    const response: AxiosResponse<SuggestResponse<HectometerSuggestDoc>> =
      await axios.get(path)

    return {
      ...response.data,
      response: {
        ...response.data.response,
        docs: response.data.response.docs.filter((doc) =>
          isHectometerWithinBounds(doc, bounds)
        ),
      },
    }
  } catch {
    throw new Error('Could not fetch hectometer posts. Please try again.')
  }
}

/**
 * Finds the nearest hectometer post to given coordinates within a specified distance.
 *
 * @param lat - Latitude of the reference point.
 * @param lng - Longitude of the reference point.
 * @param distance - Search radius in meters.
 * @param pdokBaseUrl - Base URL for the PDOK Locatieserver API.
 * @returns Nearest hectometer post or `null` if not found.
 * @throws When `pdokBaseUrl` is missing.
 */
export const getNearestHectometerPostByCoordinate = async (
  lat: number,
  lng: number,
  distance: number,
  pdokBaseUrl: string | undefined
) => {
  if (!pdokBaseUrl) {
    console.error('Pdok Base URL is required to fetch nearest hectometer post.')
    throw new Error(
      'Pdok Base URL is required to fetch nearest hectometer post.'
    )
  }

  const axios = axiosInstance(pdokBaseUrl)

  try {
    const response: AxiosResponse<CoordinateResponse<HectometerCoordinateDoc>> =
      await axios.get(
        `/search/v3_1/reverse?lat=${lat}&lon=${lng}&distance=${distance}&type=hectometerpaal&fl=id,weergavenaam,type,score,afstand,centroide_ll&fq=bron:NWB&start=0&rows=10&wt=json`
      )

    return response.data.response.docs.sort(
      (docA, docB) => docA.afstand - docB.afstand
    )[0]
  } catch {
    return null
  }
}

// Finds the nearest address to given coordinates within a specified distance
// @param {number} lat - Latitude of the reference point
// @param {number} lng - Longitude of the reference point
// @param {number} distance - Search radius in meters
// @returns {Promise<CoordinateResponse<T>['response']['docs'][0] | null>} - Nearest address or null if not found
// @throws {Error} - Returns null if the request fails
export const getNearestAddressByCoordinate = async (
  lat: number,
  lng: number,
  distance: number,
  pdokBaseUrl: string | undefined
) => {
  if (!pdokBaseUrl) {
    console.error('pdok Base Url is required to fetch nearest address.')
    throw new Error('pdok Base Url is required to fetch nearest address.')
  }
  const axios = axiosInstance(pdokBaseUrl)

  try {
    const response: AxiosResponse<CoordinateResponse<AddressCoordinateDoc>> =
      await axios.get(
        `/search/v3_1/reverse?lat=${lat}&lon=${lng}&distance=${distance}&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll,openbareruimte_id`
      )

    return response.data.response.docs.sort(
      (docA, docB) => docA.afstand - docB.afstand
    )[0]
  } catch {
    return null
  }
}

export const getLocationDisplayName = (
  formState: FormStoreState,
  coordinateMessage: string
) => {
  if (formState.address?.weergave_naam) {
    return formState.address?.weergave_naam
  }

  if (
    formState.coordinates.length === 2 &&
    formState.coordinates[0] > 0 &&
    formState.coordinates[1] > 0
  ) {
    return coordinateMessage
  }

  return ''
}
