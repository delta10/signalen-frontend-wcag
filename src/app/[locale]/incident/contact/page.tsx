import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'
import { Heading, HeadingGroup, PreHeading } from '@/components/index'
import { getTranslations } from 'next-intl/server'
import { createTitle } from '@/lib/utils/create-title'
import { Metadata } from 'next/types'

const currentStep = 3
const maxStep = 4

export async function generateMetadata(): Promise<Metadata> {
  const errorMessage = ''
  const t = await getTranslations('describe-contact')
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

export default function AddContactDetailsPage() {
  const t = useTranslations('describe-contact')
  const tGeneral = useTranslations('general.describe_form')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <HeadingGroup>
        <Heading level={1}>{t('heading')}</Heading>
        <PreHeading>
          {tGeneral('pre-heading', { current: currentStep, max: maxStep })}
        </PreHeading>
      </HeadingGroup>
      <NextIntlClientProvider messages={messages}>
        <IncidentContactForm />
      </NextIntlClientProvider>
    </div>
  )
}
