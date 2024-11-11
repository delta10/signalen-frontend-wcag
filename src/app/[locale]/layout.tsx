import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Container } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers/AppProvider'
import { Document } from '@utrecht/component-library-react/dist/css-module'
import { useTranslations } from 'next-intl'

const font = localFont({
  src: '../../../public/fonts/open-sans.woff2',
  display: 'swap',
  variable: '--custom-font',
})

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: any }
}) {
  if (!getAllAvailableLocales().includes(locale as any)) notFound()
  const t = useTranslations('current-organisation')

  return (
    <html lang={locale} className={`${font.variable}`}>
      <body className="bg-gray-100">
        <AppProvider>
          <Document className="utrecht-theme">
            <Container className="bg-white">
              <Header
                homepage={{
                  href: '/',
                  label: t('homepage-label'),
                }}
                logo={{
                  src: '/assets/utrecht.webp',
                  label: t('logo-label'),
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
