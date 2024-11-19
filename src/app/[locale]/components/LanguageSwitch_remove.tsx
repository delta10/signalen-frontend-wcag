'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from '@/routing/navigation'
import { Select } from '@/components'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { useLocale } from 'next-intl'

const LanguageSwitch_remove = () => {
  const locales = getAllAvailableLocales()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onSelectChange = (locale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale })
    })
  }

  return (
    <Select
      value={locale}
      values={getAllAvailableLocales()}
      onSelectChange={onSelectChange}
      disabled={isPending}
    />
  )
}

export { LanguageSwitch_remove }
