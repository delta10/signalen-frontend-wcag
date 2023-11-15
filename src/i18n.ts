import { getRequestConfig } from 'next-intl/server'
import { getTimeZone } from '@/lib/utils/locale'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../translations/${locale}.json`)).default,
  timeZone: 'Europe/Amsterdam',
}))
