'use client'

import { useTranslations } from 'next-intl'
import { Paragraph, Heading } from '@/components/index'
import { Button } from '@utrecht/component-library-react'
import React from 'react'
import { stepToPath, useRouter } from '@/routing/navigation'
import { FormStep } from '@/types/form'
import { useFormStore } from '@/store/form_store'

export default function Thankyou() {
  const t = useTranslations('describe-thankyou')
  const { resetForm, formState } = useFormStore()
  const router = useRouter()

  const resetState = () => {
    resetForm()
    router.push(stepToPath[FormStep.STEP_1_DESCRIPTION])
  }

  return (
    <div className="flex flex-col gap-8">
      <Heading level={1}>{t('heading')}</Heading>
      <div className="flex flex-col gap-2">
        <Paragraph>
          {t('description_notification_number', {
            sig_number: formState.sig_number,
          })}
        </Paragraph>
        <Paragraph>{t('description_notification_email')}</Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <Heading level={3}>{t('what_do_we_do_heading')}</Heading>
        <Paragraph>{t('what_do_we_do_description')}</Paragraph>
      </div>
      <Button onClick={() => resetState()}>{t('new_notification')}</Button>
    </div>
  )
}
