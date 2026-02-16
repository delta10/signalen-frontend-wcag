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
import { KtoForm } from './KtoForm'
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
      }
    }

    await submitFeedback(id, state.signalId, {
      is_satisfied: isSatisfied,
      text_list: formData.text_list,
      text_extra: formData.text_extra || null,
      allows_contact: formData.allows_contact,
    })

    setState({ status: 'success' })
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
    const titleKey = isSatisfied ? 'success_ja_title' : 'success_nee_title'
    const bodyKey = isSatisfied ? 'success_ja_body' : 'success_nee_body'

    return (
      <main className="flex flex-col gap-6">
        <Heading level={1}>{t(titleKey)}</Heading>
        <Paragraph>{t(bodyKey)}</Paragraph>
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-6">
      <Heading level={1} className="!break-normal hyphens-none">
        {isSatisfied ? t('heading_ja') : t('heading_nee')}
      </Heading>
      <KtoForm
        answer={answer}
        options={state.options}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
