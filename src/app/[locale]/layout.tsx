import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Container } from '@/components'
import { Header } from '@/app/[locale]/components/Header'
import localFont from 'next/font/local'
import AppProvider from '@/components/providers/AppProvider'
import { Document, Surface } from '@/components/index'
import { clsx } from 'clsx'

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

  return (
    <html
      lang={locale}
      className={clsx(
        'utrecht-theme',
        'utrecht-theme--media-query-color-scheme',
        `${font.variable}`
      )}
    >
      <body>
        <Surface className="utrecht-surface">
          <AppProvider>
            <Document>
              <Container>
                <Header />
                {children}
              </Container>
            </Document>
          </AppProvider>
        </Surface>
      </body>
    </html>
  )
}
