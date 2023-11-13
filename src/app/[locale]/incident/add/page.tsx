import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/components/IncidentQuestionsLocationForm'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <h1>{t('heading')}</h1>
      <NextIntlClientProvider messages={messages}>
        <IncidentQuestionsLocationForm />
      </NextIntlClientProvider>
    </div>
  )
}
