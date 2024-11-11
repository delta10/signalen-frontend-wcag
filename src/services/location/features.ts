import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { FeatureCollection } from 'geojson'

export const getGeoJsonFeatures = async (
  url: string
): Promise<FeatureCollection> => {
  const axios = axiosInstance(url)

  try {
    const response: AxiosResponse<FeatureCollection> = await axios.get('')

    return response.data
  } catch (error) {
    throw new Error('Could not fetch suggested addresses. Please try again.')
  }
}
