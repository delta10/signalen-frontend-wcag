import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/utils/locale'
import { Container } from '@/components'

const locales = getAllAvailableLocales()

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: any }
}) {
  if (!locales.includes(locale as any)) notFound()

  return (
    <html lang={locale}>
      <body className="bg-gray-100">
        <Container className="bg-white">{children}</Container>
      </body>
    </html>
  )
}
