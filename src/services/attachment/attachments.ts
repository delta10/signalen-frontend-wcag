import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import type { PublicSignalAttachment } from '@/services/client'
import { useConfig } from '@/contexts/ConfigContext'

export const postAttachments = async (
  uuid: string,
  formData: FormData,
  baseUrl?: string
): Promise<PublicSignalAttachment> => {
  const axios = axiosInstance(baseUrl)

  try {
    const response: AxiosResponse<PublicSignalAttachment> = await axios.post(
      `/signals/v1/public/signals/${uuid}/attachments/`,
      formData
    )

    return response.data
  } catch (error) {
    throw new Error('Something went wrong uploading the attachment')
  }
}
