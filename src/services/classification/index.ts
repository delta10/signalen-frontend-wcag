import { axiosInstance } from '@/services/client/api-client'
const CERTAINTY_THRESHOLD = 0.41
const MAIN_SLUG_REGEX = /\/terms\/categories\/([a-z0-9\-]+)/
const SUB_SLUG_REGEX =
  /\/terms\/categories\/[a-z0-9\-]+\/sub_categories\/([a-z0-9\-]+)/

export const getCategoryForDescription = async (description: string, baseUrl: string) => {
  const axios = axiosInstance(baseUrl)
  let prediction = {
    main: 'overig',
    sub: 'overig',
  }

  try {
    const response = await axios.post(`/signals/category/prediction`, {
      text: description,
    })

    const mainCertainty = response.data.hoofdrubriek[1][0]
    if (mainCertainty >= CERTAINTY_THRESHOLD) {
      prediction.main =
        response.data.hoofdrubriek[0][0].match(MAIN_SLUG_REGEX)[1]
    }

    const subCertainty = response.data.subrubriek[1][0]
    if (subCertainty >= CERTAINTY_THRESHOLD) {
      prediction.sub = response.data.subrubriek[0][0].match(SUB_SLUG_REGEX)[1]
    }
  } catch (e) {
    console.error('Could not fetch the classification response', e)
  }

  return prediction
}
