import { Layout } from '@/types/layout'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { Article, PageBody, PageLayout } from '@/components'
import { pick } from '@/lib/utils/utils'
import { Header } from '@/app/[locale]/components/Header'
import { Footer } from '@/app/[locale]/components/Footer'
import React from 'react'

export default function IncidentLayout({ children }: Layout) {
  const messages = useMessages()

  return (
    <>
      <PageLayout>
        <NextIntlClientProvider
          messages={pick(messages, 'current_organisation')}
        >
          <Header />
        </NextIntlClientProvider>

        <PageBody>
          <NextIntlClientProvider messages={messages}>
            <Article className="max-w-3xl mx-auto px-4 lg:px-0">
              {children}
            </Article>
          </NextIntlClientProvider>
        </PageBody>

        <NextIntlClientProvider messages={pick(messages, 'footer')}>
          <Footer />
        </NextIntlClientProvider>
      </PageLayout>
    </>
  )
}
