import { signalsClient } from '@/services/client/api-client'
import { PublicQuestion } from '@/types/form'

export const fetchAdditionalQuestions = async (
  main: string,
  sub: string
): Promise<PublicQuestion[]> => {
  try {
    const data = await signalsClient.v1.v1PublicQuestionsList(main, 1, 100, sub)

    const questions = data.results as unknown as PublicQuestion[]
    if (!questions) {
      return []
    }

    const uniqueKeys = new Set<string>()
    const deduplicatedQuestions = questions.filter((question) => {
      if (uniqueKeys.has(question.key)) {
        return false
      } else {
        uniqueKeys.add(question.key)
        return true
      }
    })

    return deduplicatedQuestions
  } catch (e) {
    console.error('Could not fetch additional questions', e)
  }

  return []
}
