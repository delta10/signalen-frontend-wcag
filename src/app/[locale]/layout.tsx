import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Container } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers/AppProvider'
import { Document } from '@utrecht/component-library-react/dist/css-module'
import { useTranslations } from 'next-intl'
import { Footer } from '@/app/[locale]/components/Footer'

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
  const t = useTranslations()

  // todo add fields to config
  const temporaryFooterData = [
    {
      label: t('footer.about'),
      href: 'https://www.amsterdam.nl/overdezesite/?pk_vid=6c52c3c3b95784761731667633654da9',
    },
    {
      label: t('footer.privacy'),
      href: 'https://www.amsterdam.nl/privacy/specifieke/privacyverklaringen-wonen/meldingen-overlast-privacy/?pk_vid=6c52c3c3b95784761731667634654da9',
    },
    {
      label: t('footer.accessibility'),
      href: 'https://meldingen.amsterdam.nl/toegankelijkheidsverklaring',
    },
  ]

  return (
    <html lang={locale} className={`${font.variable}`}>
      <body className="bg-gray-100">
        <AppProvider>
          <Document className="utrecht-theme">
            <Container className="bg-white h-dvh flex flex-col">
              <Header
                homepage={{
                  href: '/',
                  label: t('current-organisation.homepage-label'),
                }}
                logo={{
                  src: '/assets/utrecht.webp',
                  label: t('current-organisation.logo-label'),
                }}
              />
              {children}
              <Footer links={temporaryFooterData} />
            </Container>
          </Document>
        </AppProvider>
      </body>
    </html>
  )
}
