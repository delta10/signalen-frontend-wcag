import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import { Heading1 } from '@utrecht/component-library-react/dist/css-module'
import '@utrecht/design-tokens/dist/index.css'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <Heading1>{t('heading')}</Heading1>
      <NextIntlClientProvider messages={messages}>
        <IncidentQuestionsLocationForm />
      </NextIntlClientProvider>
    </div>
  )
}
