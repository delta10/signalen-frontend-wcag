import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { LinkWrapper } from '@/components/ui/LinkWrapper'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'

export default async function Home() {
  return <IncidentDescriptionPage />
}

function IncidentDescriptionPage() {
  const t = useTranslations('describe-report')
  const messages = useMessages()

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>{t('heading')}</h1>
        <NextIntlClientProvider messages={messages}>
          <IncidentDescriptionForm />
        </NextIntlClientProvider>
      </div>
    </>
  )
}
