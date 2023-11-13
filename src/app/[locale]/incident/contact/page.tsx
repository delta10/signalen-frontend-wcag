import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/components/IncidentContactForm'

export default function AddContactDetailsPage() {
  const t = useTranslations('describe-contact')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <h1>{t('heading')}</h1>
      <NextIntlClientProvider messages={messages}>
        <IncidentContactForm />
      </NextIntlClientProvider>
    </div>
  )
}
