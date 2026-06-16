'use client'

import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { Heading, Link, PageHeader } from '@/components/index'
import { useConfig } from '@/contexts/ConfigContext'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import { clsx } from 'clsx'
import { ButtonLink } from '@/components'

import { IconArrowRight } from '@tabler/icons-react'
import { stepToPath } from '@/routing/navigation'
import { FormStep } from '@/types/form'

const IncidentMapHeader = () => {
  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const t = useTranslations('current_organisation')
  const tIncidentMap = useTranslations('incident_map')
  const isMobile = useMediaQuery('only screen and (max-width : 768px)', {
    initializeWithValue: false,
  })

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
    <span
      className={clsx(
        'inline-flex max-w-full items-center overflow-hidden',
        isMobile && 'max-h-[80px]'
      )}
    >
      <Image
        src={`/assets/${logo}`}
        alt={logoAltText}
        width={config?.base.header.logo.width}
        height={config?.base.header.logo.height}
      />
    </span>
  ) : null

  const createIncidentHref = stepToPath[FormStep.STEP_1_DESCRIPTION]
  const createIncidentButton = (
    <ButtonLink
      purpose="primary"
      iconEnd={<IconArrowRight />}
      href={createIncidentHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {tIncidentMap('create_incident')}
    </ButtonLink>
  )

  return (
    <>
      <PageHeader
        className={clsx('incident-map-header', isMobile ? 'mobile' : '')}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
          <div className="flex flex-row items-center gap-6 md:gap-12">
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
            <Heading className={isMobile ? 'sr-only' : ''} level={1}>
              {tIncidentMap('heading')}
            </Heading>
          </div>

          {config && config.base.supportedLanguages.length > 1 && (
            <LanguageSwitch />
          )}
          {!isMobile && createIncidentButton}
        </div>
      </PageHeader>
    </>
  )
}

export { IncidentMapHeader }
