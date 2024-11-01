import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentSummaryForm } from '@/app/[locale]/incident/summary/components/IncidentSummaryForm'
import { HeadingGroup, Heading, PreHeading } from '@/components/index'

export default function SummaryDetailsPage() {
  const t = useTranslations('describe-summary')
  const tGeneral = useTranslations('general.describe_form')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <HeadingGroup>
        <Heading level={1}>{t('heading')}</Heading>
        <PreHeading>
          {tGeneral('pre-heading', { current: 4, max: 4 })}
        </PreHeading>
      </HeadingGroup>
      <NextIntlClientProvider messages={messages}>
        <IncidentSummaryForm />
      </NextIntlClientProvider>
    </div>
  )
}
