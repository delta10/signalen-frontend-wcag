'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  getFeedbackStatus,
  getFeedbackOptions,
  type FeedbackStatus,
  type KtoOption,
} from '@/services/feedback'
import { Heading, Paragraph, Alert } from '@/components'
import { KtoForm } from '../KtoForm'
import { postAttachments } from '@/services/attachment/attachments'
import { useConfig } from '@/contexts/ConfigContext'

type KtoContainerProps = {
  answer: 'ja' | 'nee'
  id: string
}

type ContainerState =
  | { status: 'loading' }
  | { status: 'error'; error: FeedbackStatus }
  | {
      status: 'form'
      options: KtoOption[]
      signalId: string
      uploadError?: boolean
      submitError?: boolean
    }
  | { status: 'success' }

export function KtoContainer({ answer, id }: KtoContainerProps) {
  const t = useTranslations('kto')
  const tGeneral = useTranslations('general')
  const config = useConfig()
  const [state, setState] = useState<ContainerState>({ status: 'loading' })

  const isSatisfied = answer === 'ja'

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const status = await getFeedbackStatus(id)

        if (cancelled) return

        if (status.status === 'ok') {
          const options = await getFeedbackOptions(isSatisfied)
          if (cancelled) return
          setState({
            status: 'form',
            options,
            signalId: status.data.signal_id,
          })
        } else {
          setState({ status: 'error', error: status })
        }
      } catch (e) {
        console.error('Failed to load KTO form data', e)
        if (cancelled) return
        setState({ status: 'error', error: { status: 'not_found' } })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id, isSatisfied])

  const handleSubmit = async (formData: {
    text_list: string[]
    text_extra?: string
    allows_contact?: boolean
    files?: File[]
  }) => {
    if (state.status !== 'form') return

    // Clear previous errors when retrying
    setState((prev) =>
      prev.status === 'form'
        ? { ...prev, uploadError: false, submitError: false }
        : prev
    )

    const { submitFeedback } = await import('@/services/feedback')

    // Upload photos first (only for nee path)
    if (formData.files && formData.files.length > 0 && config?.baseUrlApi) {
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
        throw new Error('Upload failed')
      }
    }

    try {
      await submitFeedback(id, state.signalId, {
        is_satisfied: isSatisfied,
        text_list: formData.text_list,
        text_extra: formData.text_extra || null,
        allows_contact: formData.allows_contact,
      })
      setState({ status: 'success' })
    } catch (e) {
      console.error('Failed to submit feedback', e)
      setState((prev) =>
        prev.status === 'form' ? { ...prev, submitError: true } : prev
      )
      throw new Error('Submit failed')
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
        {isSatisfied ? t('heading_ja') : t('heading_nee')}
      </Heading>
      {state.uploadError && (
        <Alert type="error">
          <Paragraph>{t('error_photos_failed')}</Paragraph>
        </Alert>
      )}
      <KtoForm
        answer={answer}
        options={state.options}
        onSubmit={handleSubmit}
      />
      {state.submitError && (
        <Alert type="error">
          <Paragraph>{t('error_submit_failed')}</Paragraph>
        </Alert>
      )}
    </main>
  )
}
