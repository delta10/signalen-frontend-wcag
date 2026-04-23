import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Root } from '@/components'
import localFont from 'next/font/local'
import type { PropsWithChildren } from 'react'
import { getServerConfig } from '@/services/config/config'
import { AppConfig } from '@/types/config'
import { ConfigProvider } from '@/contexts/ConfigContext'

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
  params: { locale: string }
}>) => {
  if (!getAllAvailableLocales().includes(locale)) notFound()
  const configuredTheme = config.base.theme ?? config.base.municipality
  const safeTheme = /^[a-z0-9-]+$/i.test(configuredTheme)
    ? configuredTheme
    : 'brabant'
  const organizationThemeHref = `/assets/organizations/${safeTheme}/theme.css`

  return (
    <Root
      lang={locale}
      className={`${font.variable} organization-theme organization-theme--media-query`}
    >
      <head>
        <link rel="stylesheet" href={organizationThemeHref} />
      </head>
      <body>
        <ConfigProvider config={config}>{children}</ConfigProvider>
      </body>
    </Root>
  )
}

export default async function WrappedLocaleLayout(
  props: PropsWithChildren<{
    params: Promise<{ locale: string }>
  }>
) {
  const params = await props.params

  const { locale } = params

  const { children } = props

  const config: AppConfig = await getServerConfig()

  return (
    <LocaleLayout config={config} params={{ locale }}>
      {children}
    </LocaleLayout>
  )
}
