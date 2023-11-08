import { LanguageSwitch } from '@/app/[locale]/components/LanguageSwitch'

const Navigation = () => {
  return (
    <nav className="flex justify-end bg-gray-200 py-4 px-8">
      <LanguageSwitch />
    </nav>
  )
}

export { Navigation }
