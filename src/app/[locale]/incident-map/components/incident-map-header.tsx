'use client'

import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { Heading, Link, Logo, PageHeader } from '@/components/index'
import { useConfig } from '@/contexts/ConfigContext'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useTranslations } from 'next-intl'
import { NextSvgImage } from '@/components/ui/NextSvgImage'

const IncidentMapHeader = () => {
  const config = useConfig()
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

  const logoElement = logo ? (
    <Logo caption={config ? config.base.header.logo.caption : ''}>
      <NextSvgImage src={`/assets/${logo}`} alt={logoAltText} priority={true} />
    </Logo>
  ) : null

  return (
    <>
      <PageHeader className="incident-map-header">
        <div className="flex md:items-center justify-between">
          <div className="flex items-center gap-12">
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
            <Heading level={1}>
              {/*{t('heading')}*/}
              Meldingenkaart
            </Heading>
          </div>

          {config && config.base.supportedLanguages.length > 1 && (
            <LanguageSwitch />
          )}
        </div>
      </PageHeader>
    </>
  )
}

export { IncidentMapHeader }
