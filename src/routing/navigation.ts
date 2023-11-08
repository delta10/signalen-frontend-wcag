import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation'
import { getAllAvailableLocales } from '@/utils/locale'

export const locales = getAllAvailableLocales()

export const pathnames = {
  '/': '/',
  '/notifications-map': {
    en: '/notifications-map',
    nl: '/meldingen-kaart',
  },
  '/incident': {
    en: '/incident',
    nl: '/incident',
  },
} satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames })
