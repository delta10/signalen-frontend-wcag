import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'

export default function AddAditionalInformationPage() {
  const t = useTranslations('describe-add')

  return (
    <div className="flex flex-col gap-4">
      <h1>{t('heading')}</h1>
      <IncidentFormFooter />
    </div>
  )
}
