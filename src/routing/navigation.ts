import { createNavigation } from 'next-intl/navigation'
import { defineRouting, Pathnames } from 'next-intl/routing'
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
  '/kto/[answer]/[id]': '/kto/[answer]/[id]',
} satisfies Pathnames<typeof locales>

export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',

  pathnames: { ...pathnames },
})

type Paths = keyof typeof pathnames

/** Incident form paths only - used by stepper (excludes KTO and other dynamic routes) */
export type IncidentPaths =
  | '/incident'
  | '/incident/add'
  | '/incident/contact'
  | '/incident/summary'
  | '/incident/thankyou'

export const stepToPath: { [key: number]: IncidentPaths } = {
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

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)

export type { Paths }
