import { useTranslations } from 'next-intl'
import { LinkWrapper } from '@/components/ui/LinkWrapper'

export default function Home() {
  const t = useTranslations('describe-report')

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>{t('heading')}</h1>
        <p>
          {t.rich('description', {
            link: (chunks) => (
              <LinkWrapper href={'/notifications-map'}>{chunks}</LinkWrapper>
            ),
          })}
        </p>
      </div>
    </>
  )
}
