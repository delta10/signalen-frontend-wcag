import { useTranslations } from 'next-intl'

export default function Thankyou() {
  const t = useTranslations('describe-thankyou')

  return (
    <div className="flex flex-col gap-8">
      <h1>{t('heading')}</h1>
      <div className="flex flex-col gap-2">
        <p>{t('description_notification_number')}</p>
        <p>{t('description_notification_email')}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3>{t('what_do_we_do_heading')}</h3>
        <p>{t('what_do_we_do_description')}</p>
      </div>
    </div>
  )
}
