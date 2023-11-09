import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from 'next-intl/navigation'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { createTranslator } from 'next-intl'

export const locales = getAllAvailableLocales()

// TODO: let routing based on routing translations work
// const getRoutingObjectBasedOnLocale = async (locale: string) => {
//   const routingTranslation = await import(`../../translations/${locale}.json`)
//
//   const t = createTranslator({
//     messages: routingTranslation,
//     locale,
//   })
//
//   return routingTranslation.routing
// }
//
// const getPathForLocale = (pathname: string) => {
//   const pathPerLocale: {
//     [key: string]: string
//   } = {}
//
//   getAllAvailableLocales().map(async (locale) => {
//     const routingObject = await getRoutingObjectBasedOnLocale(locale)
//
//     // console.log(routingObject, locale, pathname.replace('/', ''))
//
//     pathPerLocale[locale] = routingObject[pathname.replace('/', '')]
//   })
//
//   return pathPerLocale
// }

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
