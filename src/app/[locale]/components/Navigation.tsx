import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'
import { NavBar } from '@/components'

const Navigation = () => {
  return (
    <NavBar>
      <LanguageSwitch />
    </NavBar>
  )
}

export { Navigation }
