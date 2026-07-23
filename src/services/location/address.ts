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

type HectometerSuggestOptions = {
  bounds?: CoordinateBounds
  roadNumberPrefix?: string
}

/**
 * Creates a PDOK coordinate range filter.
 *
 * The application stores bounds as [longitude, latitude], while PDOK expects
 * latitude,longitude in this filter.
 *
 * @param param - filter query parameter
 * @param bounds - Optional bounds in [[minLng, minLat], [maxLng, maxLat]] format.
 * @returns PDOK coordinate range filter or `null` when no bounds are configured.
 */
const getBoundsFilter = (param: string, bounds?: CoordinateBounds) => {
  if (!bounds) {
    return null
  }

  const [[minLng, minLat], [maxLng, maxLat]] = bounds

  return `${param}:[${minLat},${minLng} TO ${maxLat},${maxLng}]`
}

/**
 * Creates optional PDOK filters for hectometer post suggestions.
 *
 * @param options - Optional bounds and road number prefix filters.
 * @returns Encoded PDOK filter query string parts.
 */
const getHectometerSuggestFilters = ({
  bounds,
  roadNumberPrefix,
}: HectometerSuggestOptions) => {
  const filters = [getBoundsFilter('centroide_ll', bounds)]

  if (roadNumberPrefix) {
    filters.push(`wegnummer:${roadNumberPrefix}*`)
  }

  return filters
    .filter((filter): filter is string => Boolean(filter))
    .map((filter) => `&fq=${encodeURIComponent(filter)}`)
    .join('')
}

/**
 * Creates the PDOK suggest path for hectometer post suggestions.
 *
 * @param searchQuery - Text to search for hectometer posts, for example "N263 12.3".
 * @param options - Optional bounds and road number prefix filters.
 * @returns PDOK Locatieserver suggest path.
 */
const getHectometerSuggestPath = (
  searchQuery: string,
  options: HectometerSuggestOptions
) => {
  const encodedSearchQuery = encodeURIComponent(searchQuery)
  const filters = getHectometerSuggestFilters(options)

  return `/search/v3_1/suggest?fq=bron:NWB&fq=type:hectometerpaal${filters}&fl=id,identificatie,weergavenaam,centroide_ll,wegnummer,hectometernummer,hectometerletter&q=${encodedSearchQuery}`
}

/**
 * Fetches address suggestions from the PDOK API based on a search query and municipality or province.
 *
 * @param searchQuery - Text used to search for addresses.
 * @param scope - Determines whether `organization` is matched against `gemeentenaam` or `provincienaam`.
 * @param organization - Municipality (`gemeentenaam`) or province (`provincienaam`) name, depending on `scope`.
 * @param pdokBaseUrl - Base URL for the PDOK Locatieserver API.
 * @returns A promise that resolves to the suggested addresses returned by the PDOK API.
 * @throws {Error} If the request to the PDOK API fails.
 */
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

/**
 * Fetches suggested hectometer posts from PDOK Locatieserver.
 *
 * Hectometer posts are NWB records and do not support the BAG province filter,
 * so optional coordinate bounds are used to restrict results to the configured
 * instance area.
 *
 * @param searchQuery - Text to search for hectometer posts, for example "A2 123".
 * @param pdokBaseUrl - Base URL for the PDOK Locatieserver API.
 * @param options - Optional bounds and road number prefix filters.
 * @returns Promise resolving to suggested hectometer posts.
 * @throws When `pdokBaseUrl` is missing or the request fails.
 */
export const getSuggestedHectometerPosts = async (
  searchQuery: string,
  pdokBaseUrl: string | undefined,
  options: HectometerSuggestOptions = {}
): Promise<SuggestResponse<HectometerSuggestDoc>> => {
  if (!pdokBaseUrl) {
    console.error('Pdok Base URL is required to fetch hectometer posts.')
    throw new Error('Pdok Base URL is required to fetch hectometer posts.')
  }

  const axios = axiosInstance(pdokBaseUrl)
  const path = getHectometerSuggestPath(searchQuery, options)

  try {
    const response: AxiosResponse<SuggestResponse<HectometerSuggestDoc>> =
      await axios.get(path)

    return response.data
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

/**
 * Finds the nearest address to the given coordinates within the specified search radius.
 *
 * @param lat - Latitude of the reference point.
 * @param lng - Longitude of the reference point.
 * @param distance - Search radius in meters.
 * @param pdokBaseUrl - Base URL for the PDOK Locatieserver API.
 * @returns A promise that resolves to the nearest address, or `null` if no address is found within the search radius.
 * @throws {Error} If the request to retrieve the nearest address fails.
 */
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
