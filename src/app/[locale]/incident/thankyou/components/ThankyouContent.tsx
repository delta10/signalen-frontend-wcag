'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { stepToPath, useRouter } from '@/routing/navigation'
import { FormStep } from '@/types/form'
import { Heading, Paragraph, Button, PreserveData } from '@/components'
import React from 'react'

export const ThankyouContent = () => {
  const t = useTranslations('describe_thankyou')
  const { resetForm, formState } = useFormStore()
  const router = useRouter()

  const resetState = () => {
    resetForm()
    router.push(stepToPath[FormStep.STEP_1_DESCRIPTION])
  }

  return (
    <main className="flex flex-col gap-8">
      <Heading level={1}>{t('heading')}</Heading>
      <div className="flex flex-col gap-2">
        <Paragraph>
          {t('description_notification_number')}
          <PreserveData> {formState.sig_number}</PreserveData>
        </Paragraph>
        <Paragraph>{t('description_notification_email')}</Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <Heading level={3}>{t('what_do_we_do_heading')}</Heading>
        <Paragraph>{t('what_do_we_do_description')}</Paragraph>
      </div>
      <Button appearance="primary-action-button" onClick={() => resetState()}>
        {t('new_notification')}
      </Button>
    </main>
  )
}
