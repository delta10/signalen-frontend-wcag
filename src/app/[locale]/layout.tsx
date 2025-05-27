import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Root, Body } from '@/components'
import localFont from 'next/font/local'
import type { PropsWithChildren } from 'react'
import { getServerConfig } from '@/services/config/config'
import { AppConfig } from '@/types/config'
import { ConfigProvider } from '@/contexts/ConfigContext'
// import '../../../public/assets/theme.css'
import '../../../public/assets/utrecht-temp-theme.css'

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
  if (!getAllAvailableLocales().includes(locale as any)) notFound()

  return (
    <Root
      lang={locale}
      className={`${font.variable} organization-theme organization-theme--media-query`}
    >
      <ConfigProvider config={config}>
        <Body>{children}</Body>
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
