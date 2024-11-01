import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'
import { Heading, HeadingGroup, PreHeading } from '@/components/index'

export default function AddContactDetailsPage() {
  const t = useTranslations('describe-contact')
  const tGeneral = useTranslations('general.describe_form')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <HeadingGroup>
        <Heading level={1}>{t('heading')}</Heading>
        <PreHeading>
          {tGeneral('pre-heading', { current: 3, max: 4 })}
        </PreHeading>
      </HeadingGroup>
      <NextIntlClientProvider messages={messages}>
        <IncidentContactForm />
      </NextIntlClientProvider>
    </div>
  )
}
