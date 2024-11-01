import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { IncidentDescriptionForm } from '@/app/[locale]/incident/components/IncidentDescriptionForm'
import { Alert, HeadingGroup, PreHeading, Link } from '@/components/index'

import { Paragraph, Heading } from '@/components/index'
// import { Metadata, ResolvingMetadata } from 'next/types'

// type Props = {
//   params: Promise<object>
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>
// }

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const t = useTranslations('describe-report')
//   return {
//     title: [t('heading'), 'Gemeente Purmerend'].join(' · '),
//   }
// }

export default async function Home() {
  return <IncidentDescriptionPage />
}

function IncidentDescriptionPage() {
  const t = useTranslations('describe-report')
  const tGeneral = useTranslations('general.describe_form')
  const messages = useMessages()

  return (
    <>
      <div className="flex flex-col gap-4">
        <HeadingGroup>
          <Heading level={1}>{t('heading')}</Heading>
          <PreHeading>
            {tGeneral('pre-heading', { current: 1, max: 4 })}
          </PreHeading>
        </HeadingGroup>
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

        <NextIntlClientProvider messages={messages}>
          <IncidentDescriptionForm />
        </NextIntlClientProvider>
      </div>
    </>
  )
}
