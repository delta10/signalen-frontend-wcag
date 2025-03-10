import { IncidentContactPage } from '@/app/[locale]/incident/contact/components/IncidentContactPage'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'
import { getServerConfig } from '@/services/config/config'

const currentStep = 3
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('describe_contact')
  const config = await getServerConfig()
  const tGeneral = await getTranslations('general.form')

  return {
    title: createTitle(
      [
        tGeneral('pre_heading', { current: currentStep, max: maxStep }),
        t('heading'),
        config.base.naam,
      ],
      tGeneral('title_separator')
    ),
  }
}

export default function AddContactDetailsPage() {
  return <IncidentContactPage />
}
