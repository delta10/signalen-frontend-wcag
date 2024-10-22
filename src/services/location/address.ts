import { axiosInstance } from '@/services/client/api-client'
import { AxiosResponse } from 'axios'
import { AddressSuggestResponse } from '@/types/pdok'

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
