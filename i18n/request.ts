import { getRequestConfig } from 'next-intl/server'
import { getServerConfig } from '@/services/config/config'

type AnyObject = { [key: string]: any }

const deepMerge = <T extends AnyObject, U extends AnyObject>(
  target: T,
  source: U
): T & U => {
  for (const key in source) {
    if (!source.hasOwnProperty(key)) continue;
    if (key === "__proto__" || key === "constructor") continue;
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      if (!target.hasOwnProperty(key) || typeof target[key] !== 'object') {
        target[key] = {} as any
      }
      deepMerge(target[key], source[key])
    } else {
      target[key] = source[key] as any
    }
  }
  return target as T & U
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Fallback to default locale if undefined
  if (!locale) {
    locale = 'nl' // or your default locale
  }

  const defaultMessages = (await import(`../translations/${locale}.json`))
    .default

  const config = await getServerConfig()
  const i18nMessages = config?.base?.i18n ?? { en: {}, nl: {} }
  const customMessages = locale ? i18nMessages[locale] : {}

  return {
    locale,
    messages: deepMerge(defaultMessages, customMessages),
    timeZone: 'Europe/Amsterdam',
  }
})
