import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { LinkWrapper } from '@/components/ui/LinkWrapper'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import { client } from '@/lib/apiClient'
import { ApiError } from '@/sdk'
import pick from 'lodash/pick'
import { undefined } from 'zod'

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
        <p>
          {t.rich('description', {
            link: (chunks) => (
              <LinkWrapper href={'/notifications-map'}>{chunks}</LinkWrapper>
            ),
          })}
        </p>
        <NextIntlClientProvider messages={messages}>
          <IncidentDescriptionForm />
        </NextIntlClientProvider>
      </div>
    </>
  )
}
