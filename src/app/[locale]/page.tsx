import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { LinkWrapper } from '@/components/ui/LinkWrapper'

export default function Home() {
  const t = useTranslations('describe-report')

  return (
    <main className="p-8">
      <h1>{t('heading')}</h1>
      <p>
        Voordat u een melding doet kunt u op de{' '}
        <LinkWrapper href={'/meldingen-kaart'}>meldingenkaart</LinkWrapper> zien
        welke meldingen bekend zijn bij de gemeente. Staat uw melding er niet
        bij? Maak dan een melding.
      </p>
    </main>
  )
}
