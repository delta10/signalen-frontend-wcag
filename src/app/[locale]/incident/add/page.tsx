'use client'

import { useTranslations } from 'next-intl'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import { Heading } from '@/components/index'
import { useFormStore } from '@/store/form_store'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <div className="flex flex-col gap-4">
        <>
          <Heading level={1}>{t('heading')}</Heading>
          <IncidentQuestionsLocationForm />
        </>
      </div>
    )
  }
}
