'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentSummaryForm } from '@/app/[locale]/incident/summary/components/IncidentSummaryForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { getLastPath } from '@/lib/utils/stepper'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { FormStep } from '@/types/form'

const currentStep = 4
const maxStep = 4

export const IncidentSummaryPage = () => {
  const t = useTranslations('describe_summary')
  const tGeneral = useTranslations('general.form')
  const { loaded, formState } = useFormStore()

  useEffect(() => {
    if (loaded && formState.last_completed_step < FormStep.STEP_3_CONTACT) {
      const lastPath = getLastPath(formState.last_completed_step)

      if (lastPath) {
        redirect(lastPath)
      }
    }
  }, [loaded, formState])

  if (loaded) {
    return (
      <main className="flex flex-col gap-6 md:gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre_heading', { current: currentStep, max: maxStep })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>
        <IncidentSummaryForm />
      </main>
    )
  }
}
