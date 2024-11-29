import { getRequestConfig } from 'next-intl/server'
import { getServerConfig } from '@/services/config/config'
import merge from 'lodash/merge'

export default getRequestConfig(async ({ locale }) => {
  const defaultMessages = (await import(`../translations/${locale}.json`))
    .default

  const config = await getServerConfig()
  const i18nMessages = config?.base?.i18n ?? { en: {}, nl: {} }
  const customMessages = i18nMessages[locale] ?? {}

  return {
    messages: merge(defaultMessages, customMessages),
    timeZone: 'Europe/Amsterdam',
  }
})
