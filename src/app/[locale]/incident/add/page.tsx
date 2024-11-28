import { AdditionalInformationPage } from '@/app/[locale]/incident/add/components/AdditionalInformationPage'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'
import { getServerConfig } from '@/services/config/config'

const currentStep = 2
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  const errorMessage = ''
  const t = await getTranslations('describe_add')
  const tGeneral = await getTranslations('general.form')
  const config = await getServerConfig()

  return {
    title: createTitle(
      [
        errorMessage ? tGeneral('title_prefix_error') : '',
        tGeneral('pre_heading', { current: currentStep, max: maxStep }),
        t('heading'),
        config.base.naam,
      ],
      tGeneral('title_separator')
    ),
  }
}

export default function AddAditionalInformationPage() {
  return <AdditionalInformationPage />
}
