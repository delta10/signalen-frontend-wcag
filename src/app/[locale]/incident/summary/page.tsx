'use client'

import { useTranslations } from 'next-intl'
import { IncidentSummaryForm } from '@/app/[locale]/incident/summary/components/IncidentSummaryForm'
import { Heading } from '@/components/index'
import { useFormStore } from '@/store/form_store'

export default function SummaryDetailsPage() {
  const t = useTranslations('describe-summary')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <div className="flex flex-col gap-4">
        <Heading level={1}>{t('heading')}</Heading>
        <IncidentSummaryForm />
      </div>
    )
  }
}
