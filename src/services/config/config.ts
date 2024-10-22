import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { AppConfig } from '@/types/config'

export const getConfig = async () => {
  const axios = axiosInstance(process.env.NEXT_PUBLIC_FRONTEND_URL)

  try {
    const response: AxiosResponse<AppConfig> = await axios.get('/api/config')

    return response.data
  } catch (error) {
    throw new Error('Could not fetch config. Please try again.')
  }
}
