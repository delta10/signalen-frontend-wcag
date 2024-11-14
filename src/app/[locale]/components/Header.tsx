import { Navigation } from '@/app/[locale]/components/Navigation'
import { Link, Logo } from '@/components/index'
import Image from 'next/image'

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
  const logoElement = (
    <Logo>
      <Image src={logo.src} alt={logo.label} width={275} height={150} />
    </Logo>
  )

  return (
    <header>
      {homepage ? (
        <Link boxContent href={homepage.href} aria-labelledby="logo-link-label">
          <span id="logo-link-label" hidden>
            {homepage.label}
          </span>
          {logoElement}
        </Link>
      ) : (
        logoElement
      )}
      <Navigation />
    </header>
  )
}

export { Header }
