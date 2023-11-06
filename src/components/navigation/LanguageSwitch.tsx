'use client'

import { useTransition } from 'react'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { Select } from '@/components'
import { getAllAvailableLocales } from '@/utils/locale'
import { useLocale } from 'next-intl'

const LanguageSwitch = () => {
  const locales = getAllAvailableLocales()
  const { useRouter, usePathname } = createSharedPathnamesNavigation({
    locales,
  })
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

export { LanguageSwitch }
