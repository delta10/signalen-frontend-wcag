'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, PreHeading } from '@/components'
import { IncidentSummaryForm } from '@/app/[locale]/incident/summary/components/IncidentSummaryForm'

const currentStep = 4
const maxStep = 4

export const IncidentSummaryPage = () => {
  const t = useTranslations('describe-summary')
  const tGeneral = useTranslations('general.describe_form')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <div className="flex flex-col gap-4">
        <HeadingGroup>
          <Heading level={1}>{t('heading')}</Heading>
          <PreHeading>
            {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
          </PreHeading>
        </HeadingGroup>
        <IncidentSummaryForm />
      </div>
    )
  }
}
