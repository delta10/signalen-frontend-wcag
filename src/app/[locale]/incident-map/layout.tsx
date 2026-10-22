import { Layout } from '@/types/layout'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { IncidentMapHeader } from '@/app/[locale]/incident-map/components/IncidentMapHeader'
import { PageBody, PageLayout } from '@/components'

export default function IncidentLayout({ children }: Layout) {
  const messages = useMessages()

  return (
    <PageLayout>
      <PageBody className="incident-map">
        <NextIntlClientProvider messages={messages}>
          <IncidentMapHeader />
          <div className="flex-1 min-h-0">{children}</div>
        </NextIntlClientProvider>
      </PageBody>
    </PageLayout>
  )
}
