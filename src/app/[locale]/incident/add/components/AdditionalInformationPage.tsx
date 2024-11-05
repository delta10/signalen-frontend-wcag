'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading } from '@/components'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'

export const AdditionalInformationPage = () => {
  const t = useTranslations('describe-add')
  const { loaded } = useFormStore()

  // TODO: implement nice loading state, for if loaded if false. Also create a loading state for Stepper store.
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
