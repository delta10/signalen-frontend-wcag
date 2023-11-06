'use client'

import { useTransition } from 'react'
import { createSharedPathnamesNavigation } from 'next-intl/navigation'
import { Select } from '@/components'
import { getAllAvailableLocales } from '@/utils/locale'

const LanguageSwitch = () => {
  const locales = getAllAvailableLocales()
  const { Link, useRouter, usePathname, redirect } =
    createSharedPathnamesNavigation({ locales })
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
      values={getAllAvailableLocales()}
      onSelectChange={onSelectChange}
      disabled={isPending}
    />
  )
}

export { LanguageSwitch }
