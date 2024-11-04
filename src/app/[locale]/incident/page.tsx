import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import {
  Alert,
  Heading,
  HeadingGroup,
  Paragraph,
  PreHeading,
  Link,
} from '@/components/index'
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

  const t = await getTranslations('describe-report')
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

export default async function Home() {
  return <IncidentDescriptionPage />
}

function IncidentDescriptionPage() {
  const t = useTranslations('describe-report')
  const tGeneral = useTranslations('general.describe_form')
  const errorMessage = ''
  const messages = useMessages()

  return (
    <>
      <div className="flex flex-col gap-4">
        <HeadingGroup>
          <Heading level={1}>{t('heading')}</Heading>
          <PreHeading>
            {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
          </PreHeading>
        </HeadingGroup>
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

        <NextIntlClientProvider messages={messages}>
          <IncidentDescriptionForm />
        </NextIntlClientProvider>
      </div>
    </>
  )
}
