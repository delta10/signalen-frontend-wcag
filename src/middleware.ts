import createMiddleware from 'next-intl/middleware'
import { getAllAvailableLocales, getDefaultLocale } from '@/utils/locale'
import { locales, pathnames } from '@/routing/navigation'

export default createMiddleware({
  defaultLocale: getDefaultLocale(),
  locales,
  pathnames,
})

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
