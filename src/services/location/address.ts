import { axiosInstance } from '@/services/client/api-client'

export const getSuggestedAddresses = async (searchQuery: string) => {
  const axios = axiosInstance(process.env.NEXT_PUBLIC_PDOK_URL_API)

  // TODO: put correct municipality name in query, set correct state, handle errors, set correct type
  const suggestedAddresses = await axios
    .get(
      `/search/v3_1/suggest?fq=gemeentenaam:(Zaanstad)&fl=id,weergavenaam,straatnaam,huis_nlt,postcode,woonplaatsnaam,centroide_ll&fq=bron:BAG&fq=type:adres&q=${searchQuery}`
    )
    .then((response) => {})
}
