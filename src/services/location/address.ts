import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { AddressCoordinateResponse, AddressSuggestResponse } from '@/types/pdok'
import {
  PdokAddressSuggestScope,
  pdokAddressSuggestFields,
} from '@/types/config'
import { FormStoreState } from '@/types/stores'

// Fetches suggested addresses from PDOK API based on search query and municipality or province
// @param {string} searchQuery - Text to search for addresses
// @param {PdokAddressSuggestScope} scope - `gemeente` → gemeentenaam filter, `provincie` → provincienaam
// @param {string} organization - PDOK gemeentenaam or provincienaam (see scope)
// @returns {Promise<AddressSuggestResponse>} - Promise resolving to suggested addresses
// @throws {Error} - Throws an error if the request fails
export const getSuggestedAddresses = async (
  searchQuery: string,
  scope: PdokAddressSuggestScope,
  organization: string,
  pdokBaseUrl: string | undefined
): Promise<AddressSuggestResponse> => {
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
    const response: AxiosResponse<AddressSuggestResponse> =
      await axios.get(path)

    return response.data
  } catch {
    throw new Error('Could not fetch suggested addresses. Please try again.')
  }
}

// Finds the nearest address to given coordinates within a specified distance
// @param {number} lat - Latitude of the reference point
// @param {number} lng - Longitude of the reference point
// @param {number} distance - Search radius in meters
// @returns {Promise<AddressCoordinateResponse['response']['docs'][0] | null>} - Nearest address or null if not found
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
    const response: AxiosResponse<AddressCoordinateResponse> = await axios.get(
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
