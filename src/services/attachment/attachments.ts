import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import type { PublicSignalAttachment } from '@/services/client'

export const postAttachments = async (
  uuid: string,
  formData: FormData
): Promise<PublicSignalAttachment> => {
  const axios = axiosInstance(process.env.NEXT_PUBLIC_BASE_URL_API)

  try {
    const response: AxiosResponse<PublicSignalAttachment> = await axios.post(
      `/signals/v1/public/signals/${uuid}/attachments/`,
      formData
    )

    return response.data
  } catch (error) {
    throw new Error('Could not fetch suggested addresses. Please try again.')
  }
}
