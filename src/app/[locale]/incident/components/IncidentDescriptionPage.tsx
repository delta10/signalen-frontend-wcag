'use client'

import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { Heading, Paragraph, HeadingGroup, PreHeading } from '@/components'
import { Alert, Link } from '@/components'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import pick from 'lodash/pick'
import FormProgress from '@/app/[locale]/components/FormProgress'

const currentStep = 1
const maxStep = 4

export const IncidentDescriptionPage = () => {
  const t = useTranslations('describe-report')
  const { loaded } = useFormStore()
  const tGeneral = useTranslations('general.describe_form')

  if (loaded) {
    return (
      <>
        <div className="flex flex-col gap-12">
          <FormProgress>
            <HeadingGroup>
              <Heading level={1}>{t('heading')}</Heading>
              <PreHeading>
                {tGeneral('pre-heading', {
                  current: currentStep,
                  max: maxStep,
                })}
              </PreHeading>
            </HeadingGroup>
          </FormProgress>
          <Alert>
            <Paragraph>
              Lukt het niet om een melding te doen? Bel het telefoonnummer
              <Link href="tel:14 020"> 14 020.</Link>
            </Paragraph>
            <Paragraph>
              Wij zijn bereikbaar van maandag tot en met vrijdag van 08:00 tot
              18:00 uur.
            </Paragraph>
          </Alert>
          <IncidentDescriptionForm />
        </div>
      </>
    )
  }
}
