'use client'

import { useTranslations } from 'next-intl'
import { isValidForStep3, useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { getLastPath } from '@/lib/utils/stepper'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { FormStep } from '@/types/form'

const currentStep = 3
const maxStep = 4

export const IncidentContactPage = () => {
  const t = useTranslations('describe_contact')
  const tGeneral = useTranslations('general.form')
  const { loaded, formState } = useFormStore()

  useEffect(() => {
    if (loaded && !isValidForStep3(formState)) {
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
      <div className="flex flex-col gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre_heading', { current: currentStep, max: maxStep })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>

        <IncidentContactForm />
      </div>
    )
  }
}
