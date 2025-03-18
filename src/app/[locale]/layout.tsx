import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Root, PageLayout, Body, PageBody, Article } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import { Footer } from '@/app/[locale]/components/Footer'
import pick from 'lodash/pick'
import type { PropsWithChildren } from 'react'
import { getServerConfig } from '@/services/config/config'
import { AppConfig } from '@/types/config'
import { ConfigProvider } from '@/contexts/ConfigContext'
import { headers } from 'next/headers'
import clsx from 'clsx'

const font = localFont({
  src: '../../../public/fonts/open-sans.woff2',
  display: 'swap',
  variable: '--custom-font',
})

const LocaleLayout = ({
  children,
  config,
  params: { locale },
}: PropsWithChildren<{
  config: AppConfig
  params: { locale: any }
}>) => {
  const messages = useMessages()
  const headersList = headers()
  const referer = headersList.get('referer') || ''
  const isFromIncidentMap = referer.includes('incident-map')

  if (!getAllAvailableLocales().includes(locale as any)) notFound()

  return (
    <Root
      lang={locale}
      className={`${font.variable} purmerend-theme purmerend-theme--media-query`}
    >
      <ConfigProvider config={config}>
        <Body>
          <PageLayout>
            <NextIntlClientProvider
              messages={pick(messages, 'current_organisation')}
            >
              <Header />
            </NextIntlClientProvider>

            <PageBody className={clsx(isFromIncidentMap ? 'incident-map' : '')}>
              {!isFromIncidentMap ? (
                <Article className="max-w-3xl mx-auto px-4 lg:px-0">
                  {children}
                </Article>
              ) : (
                <>{children}</>
              )}
            </PageBody>
            {!isFromIncidentMap && (
              <NextIntlClientProvider messages={pick(messages, 'footer')}>
                <Footer />
              </NextIntlClientProvider>
            )}
          </PageLayout>
        </Body>
      </ConfigProvider>
    </Root>
  )
}

export default async function WrappedLocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<{
  params: { locale: any }
}>) {
  const config: AppConfig = await getServerConfig()

  return (
    <LocaleLayout config={config} params={{ locale }}>
      {children}
    </LocaleLayout>
  )
}
