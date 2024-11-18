'use client'

import { ChangeEvent, useTransition } from 'react'
import { usePathname, useRouter } from '@/routing/navigation'
import { Select } from '@/components'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { useLocale } from 'next-intl'

const LanguageSwitch = () => {
  const locales = getAllAvailableLocales()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.replace(pathname, { locale: evt.target.value })
    })
  }

  return (
    <Select value={locale} onChange={onSelectChange} disabled={isPending}>
      {getAllAvailableLocales().map((lang, index) => (
        <option key={index}>{lang}</option>
      ))}
    </Select>
  )
}

export { LanguageSwitch }
