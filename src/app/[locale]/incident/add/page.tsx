import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentQuestionsLocationForm } from '@/app/[locale]/incident/add/components/IncidentQuestionsLocationForm'
import { Heading, HeadingGroup, PreHeading } from '@/components/index'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')
  const tGeneral = useTranslations('general.describe_form')
  const messages = useMessages()

  return (
    <div className="flex flex-col gap-4">
      <HeadingGroup>
        <Heading level={1}>{t('heading')}</Heading>
        <PreHeading>
          {tGeneral('pre-heading', { current: 2, max: 4 })}
        </PreHeading>
      </HeadingGroup>
      <NextIntlClientProvider messages={messages}>
        <IncidentQuestionsLocationForm />
      </NextIntlClientProvider>
    </div>
  )
}
