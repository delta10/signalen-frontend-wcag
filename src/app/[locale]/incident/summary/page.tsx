import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentContactForm } from '@/app/[locale]/incident/components/IncidentContactForm'

export default function SummaryDetailsPage() {
  const t = useTranslations('describe-summary')
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
