import { getLogo } from '@/lib/utils/settings'
import { Navigation } from '@/app/[locale]/components/Navigation'

const Header = () => {
  return (
    <header>
      <img
        width={'100%'}
        height={getLogo().max_height}
        alt={'gemeente logo'}
        style={{ maxHeight: getLogo().max_height }}
        src={getLogo().link}
      />
      <Navigation />
    </header>
  )
}

export { Header }
