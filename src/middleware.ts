import createMiddleware from 'next-intl/middleware'
import { getAllAvailableLocales } from '@/lib/utils/locale'
import { locales, pathnames } from '@/routing/navigation'

// Here we use the first element that getAllAvailableLocales return as the default locale
export default createMiddleware({
  defaultLocale: getAllAvailableLocales()[0],
  locales,
  pathnames,
})

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|manage|.*\\..*).*)'],
}
