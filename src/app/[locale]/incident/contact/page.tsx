import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/contact/components/IncidentContactForm'
import { Heading } from '@/components/index'

export default function AddContactDetailsPage() {
  const t = useTranslations('describe-contact')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <Heading level={1}>{t('heading')}</Heading>
      <NextIntlClientProvider messages={messages}>
        <IncidentContactForm />
      </NextIntlClientProvider>
    </div>
  )
}
