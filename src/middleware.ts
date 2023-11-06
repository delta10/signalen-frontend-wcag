import createMiddleware from 'next-intl/middleware';
import {getAllAvailableLocales, getDefaultLocale} from "@/utils/locale";

export default createMiddleware({
  locales: getAllAvailableLocales(),
  defaultLocale: getDefaultLocale()
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
