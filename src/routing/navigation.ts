import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/routing'
import { getAllAvailableLocales } from '@/lib/utils/locale'

export const locales = getAllAvailableLocales()

export const pathnames = {
  '/': '/',
  '/incident': {
    en: '/incident',
    nl: '/incident',
  },
  '/incident/add': {
    en: '/incident/add',
    nl: '/incident/vulaan',
  },
  '/incident/contact': {
    en: '/incident/contact',
    nl: '/incident/contact',
  },
  '/incident/summary': {
    en: '/incident/summary',
    nl: '/incident/samenvatting',
  },
  '/incident/thankyou': {
    en: '/incident/thankyou',
    nl: '/incident/bedankt',
  },
} satisfies Pathnames<typeof locales>

type Paths = keyof typeof pathnames

export const steps: { [key: number]: Paths } = {
  1: '/incident',
  2: '/incident/add',
  3: '/incident/contact',
  4: '/incident/summary',
  5: '/incident/thankyou',
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames })

export type { Paths }
