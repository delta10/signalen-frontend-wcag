import { useTranslations } from 'next-intl'
import { Paragraph } from '../../../../components/index'

export default function Thankyou() {
  const t = useTranslations('describe-thankyou')

  return (
    <div className="flex flex-col gap-8">
      <h1>{t('heading')}</h1>
      <div className="flex flex-col gap-2">
        <Paragraph>{t('description_notification_number')}</Paragraph>
        <Paragraph>{t('description_notification_email')}</Paragraph>
      </div>
      <div className="flex flex-col gap-2">
        <h3>{t('what_do_we_do_heading')}</h3>
        <Paragraph>{t('what_do_we_do_description')}</Paragraph>
      </div>
    </div>
  )
}
