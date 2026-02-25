import { ApiError } from '@/services/client'
import { signalsClient } from '@/services/client/api-client'
import type { Feedback, StandardAnswer } from '@/services/client'

export type FeedbackStatus =
  | { status: 'ok'; data: Feedback }
  | { status: 'filled_out' }
  | { status: 'too_late' }
  | { status: 'not_found' }

export type KtoOption = {
  value: string
  text: string
  topic: string
  open_answer: boolean
}

export async function getFeedbackStatus(
  token: string
): Promise<FeedbackStatus> {
  try {
    const data = await signalsClient.v1.v1PublicFeedbackFormsRetrieve(token)
    return { status: 'ok', data }
  } catch (error) {
    if (error instanceof ApiError && error.body) {
      const detail =
        typeof error.body?.detail === 'string'
          ? error.body.detail
          : error.body?.detail
      if (detail === 'filled out') {
        return { status: 'filled_out' }
      }
      if (detail === 'too late') {
        return { status: 'too_late' }
      }
    }
    return { status: 'not_found' }
  }
}

export async function getFeedbackOptions(
  isSatisfied: boolean
): Promise<KtoOption[]> {
  const response = await signalsClient.v1.v1PublicFeedbackStandardAnswersList(
    1,
    100
  )

  if (!response.results) return []

  return response.results
    .filter((opt) => opt.is_satisfied === isSatisfied)
    .map((opt: StandardAnswer) => ({
      value: opt.text,
      text: opt.text,
      topic: opt.topic,
      open_answer: opt.open_answer ?? false,
    }))
}

export async function submitFeedback(
  token: string,
  signalId: string,
  feedback: {
    is_satisfied: boolean
    text_list: string[]
    text_extra?: string | null
    allows_contact?: boolean
  }
): Promise<Feedback> {
  return signalsClient.v1.v1PublicFeedbackFormsUpdate(token, {
    ...feedback,
    signal_id: signalId,
  })
}
