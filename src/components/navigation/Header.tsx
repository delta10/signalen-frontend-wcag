import { getLogo } from '@/utils/settings'

const Header = () => {
  return (
    <header>
      <img style={{ maxHeight: getLogo().max_height }} src={getLogo().link} />
    </header>
  )
}

export { Header }
