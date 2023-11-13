import { useTranslations } from 'next-intl'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')

  return (
    <div className="flex flex-col gap-4">
      <h1>{t('heading')}</h1>
    </div>
  )
}
