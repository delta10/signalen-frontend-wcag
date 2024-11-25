import { IconLoader2 } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { AlertText, Icon, Paragraph } from '@/components'

export default function Loading() {
  const t = useTranslations('general')

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Icon className="signalen-loading-icon">
        <IconLoader2 className="animate-spin" />
      </Icon>
      <Paragraph>
        <AlertText>{t('loading')}</AlertText>
      </Paragraph>
    </div>
  )
}
