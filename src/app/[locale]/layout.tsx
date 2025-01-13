import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Root, PageLayout, Body, PageBody, Article } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers/AppProvider'
import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl'
import { Footer } from '@/app/[locale]/components/Footer'
import pick from 'lodash/pick'
import type { PropsWithChildren } from 'react'

const font = localFont({
  src: '../../../public/fonts/open-sans.woff2',
  display: 'swap',
  variable: '--custom-font',
})

export default function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<{
  params: { locale: any }
}>) {
  const messages = useMessages()

  if (!getAllAvailableLocales().includes(locale as any)) notFound()

  return (
    <Root lang={locale} className={`utrecht-theme`}>
      <Body>
        <AppProvider>
          <PageLayout>
            <NextIntlClientProvider
              messages={pick(messages, 'current_organisation')}
            >
              <Header />
            </NextIntlClientProvider>

            <PageBody>
              <Article className="max-w-3xl mx-auto px-4 lg:px-0">
                {children}
              </Article>
            </PageBody>
            <NextIntlClientProvider messages={pick(messages, 'footer')}>
              <Footer />
            </NextIntlClientProvider>
          </PageLayout>
        </AppProvider>
      </Body>
    </Root>
  )
}
