import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <main>
      <h1>Signalen Frontend POC</h1>
      <p>{t('welcome')}</p>
    </main>
  )
}
