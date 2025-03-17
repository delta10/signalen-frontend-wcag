import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'
import { getServerConfig } from '@/services/config/config'
import React from 'react'
import { IncidentMap } from '@/app/[locale]/incident-map/components/IncidentMap'

const currentStep = 1
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  const config = await getServerConfig()
  const t = await getTranslations('describe_report')
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

export default async function Home() {
  return (
    <>
      <IncidentMap />
    </>
  )
}
