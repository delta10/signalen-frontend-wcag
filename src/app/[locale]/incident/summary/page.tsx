import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentSummaryForm } from '@/app/[locale]/incident/summary/components/IncidentSummaryForm'
import { Heading } from '@/components/index'

export default function SummaryDetailsPage() {
  const t = useTranslations('describe-summary')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <Heading level={1}>{t('heading')}</Heading>
      <NextIntlClientProvider messages={messages}>
        <IncidentSummaryForm />
      </NextIntlClientProvider>
    </div>
  )
}
