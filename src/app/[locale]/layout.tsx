import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Container } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers/AppProvider'
import { Document } from '@utrecht/component-library-react/dist/css-module'
import { getTranslations } from 'next-intl/server'
import { getServerConfig } from '@/services/config/config'
import '@nl-design-system-unstable/voorbeeld-design-tokens/dist/theme.css'

const font = localFont({
  src: '../../../public/fonts/open-sans.woff2',
  display: 'swap',
  variable: '--custom-font',
})

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!getAllAvailableLocales().includes(locale as any)) notFound()
  const t = await getTranslations('current-organisation')
  const config = await getServerConfig()

  return (
    <html lang={locale} className={`${font.variable}`}>
      <body className="bg-gray-100">
        <AppProvider>
          <Document className={`utrecht-theme ${config.base.className}`}>
            <Container className="bg-white">
              <Header
                homepage={{
                  href: '/',
                  label: t('homepage-label'),
                }}
                logo={{
                  src: config.base.header.logo.url,
                  label: config.base.header.logo.alt,
                }}
              />
              {children}
            </Container>
          </Document>
        </AppProvider>
      </body>
    </html>
  )
}
