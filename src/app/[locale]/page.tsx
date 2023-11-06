import { useTranslations } from 'next-intl'
import { LanguageSwitch } from '@/components/navigation/LanguageSwitch'

export default function Home() {
  const t = useTranslations('homepage')

  return (
    <main className="application__container">
      <h1>Signalen Frontend POC</h1>
      <p>{t('welcome')}</p>
      <LanguageSwitch />
    </main>
  )
}
