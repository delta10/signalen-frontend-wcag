'use client'

import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, HeadingGroup, Paragraph, PreHeading } from '@/components'
import { SpotlightSection } from '@/components'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import FormProgress from '@/app/[locale]/components/FormProgress'
import { useConfig } from '@/contexts/ConfigContext'
import { RenderMarkdown } from '@/components/ui/RenderMarkdown'
import { NextLinkWrapper } from '@/components/ui/NextLinkWrapper'
import { stepToPath } from '@/routing/navigation'
import { FormStep } from '@/types/form'
import React from 'react'

const currentStep = 1
const maxStep = 4

export const IncidentDescriptionPage = () => {
  const t = useTranslations('describe_report')
  const tIncidentMap = useTranslations('incident_map')
  const { loaded } = useFormStore()
  const config = useConfig()
  const tGeneral = useTranslations('general.form')

  if (loaded) {
    return (
      <main className="flex flex-col gap-12">
        <FormProgress>
          <HeadingGroup>
            <Heading level={1}>{t('heading')}</Heading>
            <PreHeading>
              {tGeneral('pre_heading', {
                current: currentStep,
                max: maxStep,
              })}
            </PreHeading>
          </HeadingGroup>
        </FormProgress>
        <Paragraph>
          {tIncidentMap('pre_introduction')}
          <NextLinkWrapper href="/incident-map" target="_blank">
            {tIncidentMap('incident_map')}
          </NextLinkWrapper>{' '}
          {tIncidentMap('post_introduction')}
        </Paragraph>
        {config ? (
          <SpotlightSection type="info">
            <RenderMarkdown text={t('alert.help_text')} />
          </SpotlightSection>
        ) : null}
        <IncidentDescriptionForm />
      </main>
    )
  }
}
