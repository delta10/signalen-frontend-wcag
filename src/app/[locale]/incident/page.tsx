'use client'

import { useTranslations } from 'next-intl'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import { Alert, Link } from '@utrecht/component-library-react/dist/css-module'

import { Paragraph, Heading } from '@/components/index'
import { useFormStore } from '@/store/form_store'

export default async function Home() {
  return <IncidentDescriptionPage />
}

function IncidentDescriptionPage() {
  const t = useTranslations('describe-report')
  const { loaded } = useFormStore()

  if (loaded) {
    return (
      <>
        <div className="flex flex-col gap-4">
          <Heading level={1}>{t('heading')}</Heading>
          <Alert>
            <Paragraph>
              Lukt het niet om een melding te doen? Bel het telefoonnummer
              <Link href="tel:14 020"> 14 020.</Link>
            </Paragraph>
            <Paragraph>
              Wij zijn bereikbaar van maandag tot en met vrijdag van 08:00 tot
              18:00 uur.
            </Paragraph>
          </Alert>
          <IncidentDescriptionForm />
        </div>
      </>
    )
  }
}
