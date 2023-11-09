import { getLogo } from '@/lib/utils/settings'
import { Navigation } from '@/app/[locale]/components/Navigation'

const Header = () => {
  return (
    <header>
      <img style={{ maxHeight: getLogo().max_height }} src={getLogo().link} />
      <Navigation />
    </header>
  )
}

export { Header }
