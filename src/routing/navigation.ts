import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/routing'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { FormStep } from '@/types/form'

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

export const stepToPath: { [key: number]: Paths } = {
  1: '/incident',
  2: '/incident/add',
  3: '/incident/contact',
  4: '/incident/summary',
  5: '/incident/thankyou',
}

export const pathToStep: { [key: string]: FormStep } = {
  '/incident': FormStep.STEP_1_DESCRIPTION,
  '/incident/add': FormStep.STEP_2_ADD,
  '/incident/contact': FormStep.STEP_3_CONTACT,
  '/incident/summary': FormStep.STEP_4_SUMMARY,
  '/incident/thankyou': FormStep.STEP_5_THANK_YOU,
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames })

export type { Paths }
