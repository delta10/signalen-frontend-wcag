import { axiosInstance } from '@/services/client/api-client'
import type { PublicSignalSerializerDetail } from '@/services/client'

export const getPublicSignal = async (
  signalId: string,
  baseUrl?: string
): Promise<PublicSignalSerializerDetail | null> => {
  try {
    const axios = axiosInstance(baseUrl)
    const response = await axios.get<PublicSignalSerializerDetail>(
      `/signals/v1/public/signals/${signalId}/`
    )
    return response.data
  } catch {
    return null
  }
}
