import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { getServerConfig } from '@/services/config/config'
import { ExtraInformationContainer } from './components/ExtraInformationContainer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  if (!id) return {}

  const t = await getTranslations('extra_information')
  const config = await getServerConfig()
  const tGeneral = await getTranslations('general.form')

  return {
    title: createTitle(
      [t('heading'), config.base.naam],
      tGeneral('title_separator')
    ),
  }
}

export default async function ExtraInformationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  return <ExtraInformationContainer sessionId={id} />
}
