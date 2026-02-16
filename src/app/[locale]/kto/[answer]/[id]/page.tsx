import { notFound } from 'next/navigation'
import { Metadata } from 'next/types'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { getServerConfig } from '@/services/config/config'
import { KtoContainer } from './KtoContainer'

const VALID_ANSWERS = ['ja', 'nee'] as const
type ValidAnswer = (typeof VALID_ANSWERS)[number]

function isValidAnswer(answer: string): answer is ValidAnswer {
  return VALID_ANSWERS.includes(answer as ValidAnswer)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ answer: string; id: string }>
}): Promise<Metadata> {
  const { answer } = await params
  if (!isValidAnswer(answer)) return {}

  const t = await getTranslations('kto')
  const config = await getServerConfig()
  const tGeneral = await getTranslations('general.form')

  return {
    title: createTitle(
      [t('heading'), config.base.naam],
      tGeneral('title_separator')
    ),
  }
}

export default async function KtoPage({
  params,
}: {
  params: Promise<{ answer: string; id: string }>
}) {
  const { answer, id } = await params

  if (!isValidAnswer(answer)) {
    notFound()
  }

  return <KtoContainer answer={answer} id={id} />
}
