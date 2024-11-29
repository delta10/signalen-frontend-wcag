import { IncidentDescriptionPage } from '@/app/[locale]/incident/components/IncidentDescriptionPage'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'

// TODO: Consider if these should be static params
const currentStep = 1
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  // TODO: Somehow obtain errorMessage status, or remove this code.
  // Trying to achieve this prefix because of NL Design System guidelines:
  // "Update het <title> element in de <head>"
  // https://nldesignsystem.nl/richtlijnen/formulieren/foutmeldingen/screenreaderfeedback
  const errorMessage = ''

  const t = await getTranslations('describe_report')
  const tGeneral = await getTranslations('general.form')

  return {
    title: createTitle(
      [
        errorMessage ? tGeneral('title_prefix_error') : '',
        tGeneral('pre_heading', { current: currentStep, max: maxStep }),
        t('heading'),
        'gemeente Voorbeeld',
      ],
      tGeneral('title_separator')
    ),
  }
}

export default async function Home() {
  return <IncidentDescriptionPage />
}
