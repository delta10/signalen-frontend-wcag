import { IncidentSummaryPage } from '@/app/[locale]/incident/summary/components/IncidentSummaryPage'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'

const currentStep = 4
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  const errorMessage = ''
  const t = await getTranslations('describe-summary')
  const tGeneral = await getTranslations('general.describe_form')

  return {
    title: createTitle(
      [
        errorMessage ? tGeneral('title-prefix-error') : '',
        tGeneral('pre-heading', { current: currentStep, max: maxStep }),
        t('heading'),
        'gemeente Voorbeeld',
      ],
      tGeneral('title-separator')
    ),
  }
}

export default function SummaryDetailsPage() {
  return <IncidentSummaryPage />
}
