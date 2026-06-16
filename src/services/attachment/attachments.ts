import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import type { PublicSignalAttachment } from '@/services/client'

export const postAttachments = async (
  baseUrl: string | undefined,
  uuid: string,
  formData: FormData
): Promise<PublicSignalAttachment> => {
  if (!baseUrl) {
    console.error('Base URL is required to post attachments.')
    throw new Error('Base URL is required to post attachments.')
  }
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
