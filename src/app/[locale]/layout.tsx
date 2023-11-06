import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/utils/locale'
import { Container } from '@/components'
import { Header } from '@/components/navigation/Header'
import localFont from 'next/font/local'

const font = localFont({
  src: '../../../public/fonts/poppins.woff2',
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
    <html lang={locale} className={`${font.variable}`}>
      <body className="bg-gray-100">
        <Container className="bg-white">
          <Header />
          {children}
        </Container>
      </body>
    </html>
  )
}
