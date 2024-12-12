import React from 'react'
import { Metadata } from 'next/types'
import { getServerConfig } from '@/services/config/config'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { ThankyouContent } from '@/app/[locale]/incident/thankyou/components/ThankyouContent'

export async function generateMetadata(): Promise<Metadata> {
  const config = await getServerConfig()
  const t = await getTranslations('describe_thankyou')
  const tGeneral = await getTranslations('general.form')

  return {
    title: createTitle(
      [t('heading'), config.base.naam],
      tGeneral('title_separator')
    ),
  }
}

export default function Thankyou() {
  return <ThankyouContent />
}
