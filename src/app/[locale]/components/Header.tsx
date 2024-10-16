import { Navigation } from '@/app/[locale]/components/Navigation'
import Image from 'next/image'

const Header = () => {
  return (
    <header>
      <Image
        src={'/assets/utrecht.webp'}
        alt={'Gemeente logo'}
        width={275}
        height={150}
      />
      <Navigation />
    </header>
  )
}

export { Header }
