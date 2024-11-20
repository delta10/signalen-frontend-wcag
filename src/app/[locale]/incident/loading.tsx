import { IconLoader2 } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations('general')

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/*todo: ook hier kleur van gemeente nog toepassen */}
      <IconLoader2 className="h-24 w-24 animate-spin" />
      <p className="text-lg">{t('loading')}...</p>
      <span className="sr-only">{t('loading')}...</span>
    </div>
  )
}
