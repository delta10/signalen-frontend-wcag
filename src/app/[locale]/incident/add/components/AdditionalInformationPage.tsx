'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
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
  const t = useTranslations('describe-add')
  const tGeneral = useTranslations('general.describe_form')
  const { loaded, formState } = useFormStore()

  useEffect(() => {
    if (loaded && formState.last_completed_step < FormStep.STEP_1_DESCRIPTION) {
      const lastPath = getLastPath(formState.last_completed_step)

      if (lastPath) {
        redirect(lastPath)
      }
    }
  }, [loaded, formState])

  if (loaded) {
    return (
      <div className="flex flex-col gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>
        <IncidentQuestionsLocationForm />
      </div>
    )
  }
}
