'use client'

import { useTranslations } from 'next-intl'
import { isValidForStep2, useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { getLastPath } from '@/lib/utils/stepper'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { FormStep } from '@/types/form'

const currentStep = 2
const maxStep = 4

export const AdditionalInformationPage = () => {
  const t = useTranslations('describe_add')
  const tGeneral = useTranslations('general.form')
  const { loaded, formState } = useFormStore()

  useEffect(() => {
    if (loaded && !isValidForStep2(formState)) {
      const lastPath = getLastPath(formState.last_completed_step)

      if (lastPath) {
        redirect(lastPath)
      } else {
        redirect('/')
      }
    }
  }, [loaded, formState])

  if (loaded) {
    return (
      <main className="flex flex-col gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre_heading', { current: currentStep, max: maxStep })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>
        <IncidentQuestionsLocationForm />
      </main>
    )
  }
}
