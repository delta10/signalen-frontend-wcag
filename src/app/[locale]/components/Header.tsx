'use client'

import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { Link, Logo, PageHeader } from '@/components/index'
import Image from 'next/image'
import { useConfig } from '@/hooks/useConfig'

export interface HeaderProps {
  homepage?: {
    href: string
    label: string
  }
  logo: {
    src: string
    label: string
  }
}

const Header = ({ homepage, logo }: HeaderProps) => {
  const { config } = useConfig()

  const logoElement = (
    <Logo>
      <Image src={logo.src} alt={logo.label} width={275} height={150} />
    </Logo>
  )

  return (
    <>
      <PageHeader>
        <div className="flex flex-row items-center justify-between">
          {homepage ? (
            <Link
              boxContent
              href={homepage.href}
              aria-labelledby="logo-link-label"
            >
              <span id="logo-link-label" hidden>
                {homepage.label}
              </span>
              {logoElement}
            </Link>
          ) : (
            logoElement
          )}
          {config && config.base.multilanguage && <LanguageSwitch />}
        </div>
      </PageHeader>
    </>
  )
}

export { Header }
