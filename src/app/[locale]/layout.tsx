import { notFound } from 'next/navigation'
import React from 'react'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { Body } from '@/components'
import { ThemeRoot } from '@/components/ThemeRoot'
import localFont from 'next/font/local'
import type { PropsWithChildren } from 'react'
import { getServerConfig } from '@/services/config/config'
import { AppConfig } from '@/types/config'
import { ConfigProvider } from '@/contexts/ConfigContext'
import type { ThemeId } from '@/lib/theme'

// Beide thema's importeren – het actieve thema wordt via class op Root bepaald
import '@nl-design-system-community/purmerend-design-tokens/dist/theme.css'
import '@nl-design-system-community/purmerend-design-tokens/dist/color-scheme-dark/theme.css'
import '@utrecht/design-tokens/dist/theme.css'
import '@utrecht/design-tokens/dist/dark/theme.css'
import '@/app/theme-purmerend.css'
import '@/app/theme-utrecht.css'

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

  const theme: ThemeId = config.base.theme ?? 'purmerend'

  return (
    <ThemeRoot theme={theme} lang={locale} className={font.variable}>
      <ConfigProvider config={config}>
        <Body>{children}</Body>
      </ConfigProvider>
    </ThemeRoot>
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
