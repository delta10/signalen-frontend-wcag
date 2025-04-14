'use client'

import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { Heading, Link, Logo, PageHeader } from '@/components/index'
import { useConfig } from '@/contexts/ConfigContext'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useTranslations } from 'next-intl'
import { NextSvgImage } from '@/components/ui/NextSvgImage'
import { useMediaQuery } from 'usehooks-ts'

const IncidentMapHeader = () => {
  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const t = useTranslations('current_organisation')
  const tIncidentMap = useTranslations('incident_map')
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')

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
    <Logo
      className={isMobile ? 'mobile-header' : ''}
      caption={config ? config.base.header.logo.caption : ''}
    >
      <NextSvgImage src={`/assets/${logo}`} alt={logoAltText} priority={true} />
    </Logo>
  ) : null

  return (
    <>
      <PageHeader className="incident-map-header">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-row items-center gap-4 md:gap-12">
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
            <Heading level={1}>{tIncidentMap('heading')}</Heading>
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
