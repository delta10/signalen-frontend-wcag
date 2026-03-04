import { axiosInstance } from '@/services/client/api-client'

export type QaSessionQuestion = {
  uuid: string
  label: string
  short_label: string
  field_type: string
  required: boolean
  _links?: {
    'sia:post-answer'?: { href: string }
  }
}

export type QaSessionResponse = {
  uuid: string
  submit_before: string
  created_at: string
  signal_snapshot?: {
    signal_id: string
    id: number
    location?: unknown
  }
  path_questions: QaSessionQuestion[]
  path_answered_question_uuids: string[]
  path_unanswered_question_uuids: string[]
  _links?: {
    'sia:post-answers'?: { href: string }
    'sia:post-attachments'?: { href: string }
    'sia:post-submit'?: { href: string }
  }
}

export type QaSessionStatus =
  | { status: 'ok'; data: QaSessionResponse }
  | { status: 'not_found' }
  | { status: 'too_late' }
  | { status: 'filled_out' }

export const getQaSession = async (
  sessionId: string,
  baseUrl?: string,
  locale?: string
): Promise<QaSessionStatus> => {
  try {
    const axios = axiosInstance(baseUrl)
    const response = await axios.get<QaSessionResponse>(
      `/signals/v1/public/qa/sessions/${sessionId}/`,
      {
        headers: locale ? { 'Accept-Language': locale } : undefined,
      }
    )
    return { status: 'ok', data: response.data }
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response
      ?.status
    const detail = (error as { response?: { data?: { detail?: string } } })
      ?.response?.data?.detail

    if (status === 404) return { status: 'not_found' }
    if (typeof detail === 'string') {
      if (detail.toLowerCase().includes('too late'))
        return { status: 'too_late' }
      if (detail.toLowerCase().includes('filled out')) {
        return { status: 'filled_out' }
      }
    }
    return { status: 'not_found' }
  }
}

export const postQaAnswer = async (
  questionUuid: string,
  sessionId: string,
  payload: string,
  baseUrl?: string
): Promise<void> => {
  const axios = axiosInstance(baseUrl)
  await axios.post(`/signals/v1/public/qa/questions/${questionUuid}/answer`, {
    payload,
    session: sessionId,
  })
}

export const postQaSubmit = async (
  sessionId: string,
  baseUrl?: string
): Promise<void> => {
  const axios = axiosInstance(baseUrl)
  await axios.post(`/signals/v1/public/qa/sessions/${sessionId}/submit/`)
}
