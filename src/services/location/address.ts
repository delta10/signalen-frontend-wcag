import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { AddressCoordinateResponse, AddressSuggestResponse } from '@/types/pdok'

// Fetches suggested addresses from PDOK API based on search query and municipality
// @param {string} searchQuery - Text to search for addresses
// @param {string} municipality - Name of the municipality to filter results
// @returns {Promise<AddressSuggestResponse>} - Promise resolving to suggested addresses
// @throws {Error} - Throws an error if the request fails
export const getSuggestedAddresses = async (
  searchQuery: string,
  municipality: string
): Promise<AddressSuggestResponse> => {
  const axios = axiosInstance(process.env.NEXT_PUBLIC_PDOK_URL_API)

  try {
    const response: AxiosResponse<AddressSuggestResponse> = await axios.get(
      `/search/v3_1/suggest?fq=gemeentenaam:(${municipality})&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll&fq=bron:BAG&fq=type:adres&q=${searchQuery}`
    )

    return response.data
  } catch (error) {
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
  distance: number
) => {
  const axios = axiosInstance(process.env.NEXT_PUBLIC_PDOK_URL_API)

  try {
    const response: AxiosResponse<AddressCoordinateResponse> = await axios.get(
      `/search/v3_1/reverse?lat=${lat}&lon=${lng}&distance=${distance}`
    )

    return response.data.response.docs.sort(
      (docA, docB) => docA.afstand - docB.afstand
    )[0]
  } catch (error) {
    return null
  }
}
