import { getLogo } from '@/utils/settings'
import { Navigation } from '@/components/navigation/Navigation'

const Header = () => {
  return (
    <header>
      <img style={{ maxHeight: getLogo().max_height }} src={getLogo().link} />
      <Navigation />
    </header>
  )
}

export { Header }
