'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'

const currentStep = 3
const maxStep = 4

export const IncidentContactPage = () => {
  const t = useTranslations('describe-contact')
  const tGeneral = useTranslations('general.describe_form')
  const { loaded } = useFormStore()

  // TODO: implement nice loading state, for if loaded if false. Also create a loading state for Stepper store.
  if (loaded) {
    return (
      <div className="flex flex-col gap-4">
        <HeadingGroup>
          <Heading level={1}>{t('heading')}</Heading>
          <PreHeading>
            {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
          </PreHeading>
        </HeadingGroup>
        <IncidentContactForm />
      </div>
    )
  }
}
