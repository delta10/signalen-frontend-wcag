import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import { Heading } from '@/components/index'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <Heading level={1}>{t('heading')}</Heading>
      <NextIntlClientProvider messages={messages}>
        <IncidentQuestionsLocationForm />
      </NextIntlClientProvider>
    </div>
  )
}
