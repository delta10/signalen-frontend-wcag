import { useTranslations } from 'next-intl'
import { LinkWrapper } from '@/components/ui/LinkWrapper'

export default function Home() {
  const t = useTranslations('describe-report')

  return (
    <main className="p-8">
      <h1>{t('heading')}</h1>
      <p>
        {t.rich('description', {
          link: (chunks) => (
            <LinkWrapper href={'/notifications-map'}>{chunks}</LinkWrapper>
          ),
        })}
      </p>
    </main>
  )
}
