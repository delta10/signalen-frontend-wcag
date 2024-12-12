'use client'

import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { Link, Logo, PageHeader } from '@/components/index'
import Image from 'next/image'
import { useConfig } from '@/hooks/useConfig'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useTranslations } from 'next-intl'

const Header = () => {
  const { config } = useConfig()
  const { isDarkMode } = useDarkMode()
  const t = useTranslations('current_organisation')

  const homepageHref = config?.base.links.home
  const logo =
    isDarkMode && config?.base.header.logo.dark_mode_url
      ? config?.base.header.logo.dark_mode_url
      : config?.base.header.logo.url

  const logoAltText = config?.base.header.logo.alt
    ? config.base.header.logo.alt
    : t('default_logo_label', {
        organization: config?.base.municipality_display_name,
      })

  const logoElement = (
    <Logo caption={config ? config.base.header.logo.caption : ''}>
      <Image
        src={`/assets/${logo}`}
        alt={logoAltText}
        width={275}
        height={150}
        priority={true}
      />
    </Logo>
  )

  return (
    <>
      <PageHeader>
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          {homepageHref ? (
            <Link
              boxContent
              href={homepageHref}
              aria-labelledby="logo-link-label"
            >
              <span id="logo-link-label" hidden>
                {t('default_homepage_label', {
                  organization: config?.base.municipality_display_name,
                })}
              </span>
              {logoElement}
            </Link>
          ) : (
            logoElement
          )}
          {config && config.base.supportedLanguages.length > 1 && (
            <LanguageSwitch />
          )}
        </div>
      </PageHeader>
    </>
  )
}

export { Header }
