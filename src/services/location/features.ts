import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { FeatureCollection } from 'geojson'

// Fetches GeoJSON feature collection from a specified URL
// @param {string} url - Base URL for the GeoJSON endpoint
// @returns {Promise<FeatureCollection>} - Promise resolving to a GeoJSON feature collection
// @throws {Error} - Throws an error if the request fails
export const getGeoJsonFeatures = async (
  url: string
): Promise<FeatureCollection> => {
  const axios = axiosInstance(url)

  try {
    const response: AxiosResponse<FeatureCollection> = await axios.get('')

    return response.data
  } catch (error) {
    throw new Error('Could not fetch suggested features. Please try again.')
  }
}
