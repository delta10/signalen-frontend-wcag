'use client'

import React, { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  getQaSession,
  postQaAnswer,
  postQaSubmit,
  type QaSessionStatus,
  type QaSessionQuestion,
} from '@/services/qa-session'
import { getPublicSignal } from '@/services/signals'
import { postAttachments } from '@/services/attachment/attachments'
import { Heading, Paragraph, Alert } from '@/components'
import { ExtraInformationForm } from '@/app/[locale]/incident/reactie/[id]/components/ExtraInformationForm'
import { useConfig } from '@/contexts/ConfigContext'

type ExtraInformationContainerProps = {
  sessionId: string
}

type ContainerState =
  | { status: 'loading' }
  | { status: 'error'; error: QaSessionStatus }
  | {
      status: 'form'
      questions: QaSessionQuestion[]
      signalId: string
      signalNumber: number
      createdAt: string
      uploadError?: boolean
      submitError?: boolean
    }
  | { status: 'success' }

const MAX_FILES = 3

export const ExtraInformationContainer = ({
  sessionId,
}: ExtraInformationContainerProps) => {
  const locale = useLocale()
  const t = useTranslations('extra_information')
  const tGeneral = useTranslations('general')
  const config = useConfig()
  const [state, setState] = useState<ContainerState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getQaSession(sessionId, config?.baseUrlApi, locale)

        if (cancelled) return

        if (result.status === 'ok') {
          const { data } = result
          const questions = data.path_questions ?? []
          const signalSnapshot = data.signal_snapshot
          const signalId = signalSnapshot?.signal_id ?? ''
          const signalNumber = signalSnapshot?.id ?? 0
          // "Gemeld op" = when the report was created; use signal's created_at, not QA session's
          const signal = signalId
            ? await getPublicSignal(signalId, config?.baseUrlApi)
            : null
          const createdAt = signal?.created_at ?? data.created_at ?? ''

          setState({
            status: 'form',
            questions,
            signalId,
            signalNumber,
            createdAt,
          })
        } else {
          setState({ status: 'error', error: result })
        }
      } catch (e) {
        console.error('Failed to load extra information form data', e)
        if (cancelled) return
        setState({ status: 'error', error: { status: 'not_found' } })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [sessionId, config?.baseUrlApi, locale])

  const handleSubmit = async (formData: {
    answers: Record<string, string>
    files?: File[]
  }) => {
    if (state.status !== 'form') return

    setState((prev) =>
      prev.status === 'form'
        ? { ...prev, uploadError: false, submitError: false }
        : prev
    )

    if (
      formData.files &&
      formData.files.length > 0 &&
      config?.baseUrlApi &&
      state.signalId
    ) {
      try {
        await Promise.all(
          formData.files.map((file) => {
            const fd = new FormData()
            fd.append('signal_id', state.signalId)
            fd.append('file', file)
            return postAttachments(state.signalId, fd, config.baseUrlApi)
          })
        )
      } catch (e) {
        console.error('Failed to upload attachments', e)
        setState((prev) =>
          prev.status === 'form' ? { ...prev, uploadError: true } : prev
        )
        return
      }
    }

    try {
      for (const question of state.questions) {
        const answer = formData.answers[question.uuid]
        if (answer?.trim()) {
          await postQaAnswer(
            question.uuid,
            sessionId,
            answer.trim(),
            config?.baseUrlApi
          )
        }
      }
      await postQaSubmit(sessionId, config?.baseUrlApi)
      setState({ status: 'success' })
    } catch (e) {
      console.error('Failed to submit extra information', e)
      setState((prev) =>
        prev.status === 'form' ? { ...prev, submitError: true } : prev
      )
    }
  }

  if (state.status === 'loading') {
    return (
      <main className="flex flex-col gap-6">
        <Heading level={1}>{t('heading')}</Heading>
        <Paragraph>{tGeneral('loading')}</Paragraph>
      </main>
    )
  }

  if (state.status === 'error') {
    const error = state.error
    const titleKey =
      error.status === 'filled_out'
        ? 'error_filled_out_title'
        : error.status === 'too_late'
          ? 'error_too_late_title'
          : 'error_not_found_title'
    const bodyKey =
      error.status === 'filled_out'
        ? 'error_filled_out_body'
        : error.status === 'too_late'
          ? 'error_too_late_body'
          : 'error_not_found_body'

    return (
      <main className="flex flex-col gap-6">
        <Heading level={1}>{t(titleKey)}</Heading>
        <Alert type="error">
          <Paragraph>{t(bodyKey)}</Paragraph>
        </Alert>
      </main>
    )
  }

  if (state.status === 'success') {
    return (
      <main className="flex flex-col gap-6">
        <Heading level={1}>{t('success_title')}</Heading>
        <Paragraph>{t('success_body')}</Paragraph>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6">
      <Heading level={1} className="!break-normal hyphens-none">
        {t('heading')}
      </Heading>
      {state.uploadError && (
        <Alert type="error">
          <Paragraph>{t('error_photos_failed')}</Paragraph>
        </Alert>
      )}
      <ExtraInformationForm
        questions={state.questions}
        signalNumber={state.signalNumber}
        createdAt={state.createdAt}
        onSubmit={handleSubmit}
        maxFiles={MAX_FILES}
        showFileUpload={true}
      />
      {state.submitError && (
        <Alert type="error">
          <Paragraph>{t('error_submit_failed')}</Paragraph>
        </Alert>
      )}
    </main>
  )
}
