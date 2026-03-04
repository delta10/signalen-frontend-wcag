'use client'

import { ButtonGroup, LinkButton } from '@/components'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { useParams } from 'next/navigation'
import { usePathname, useRouter } from '@/routing/navigation'
import { useConfig } from '@/contexts/ConfigContext'

/**
 * next-intl's usePathname returns the template for dynamic routes
 * (e.g. "/incident/reactie/[id]" literally).  For those we need the
 * object form { pathname, params } with real string values from useParams().
 * Falls back to the plain pathname when no brackets are found or when any
 * required param is missing / not a string.
 */
function resolveRoute(
  internalPath: string,
  routeParams: ReturnType<typeof useParams>
) {
  if (!internalPath.includes('[')) return internalPath

  const params: Record<string, string> = {}
  for (const m of internalPath.matchAll(/\[(\w+)\]/g)) {
    const val = routeParams[m[1]]
    if (typeof val !== 'string') return internalPath
    params[m[1]] = val
  }
  return { pathname: internalPath, params }
}

const LanguageSwitchInner = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const routeParams = useParams()
  const config = useConfig()
  const [isPending, startTransition] = useTransition()

  const onLanguageChange = (newLocale: string) => {
    startTransition(() => {
      const route = resolveRoute(pathname, routeParams)
      router.replace(route as Parameters<typeof router.replace>[0], {
        locale: newLocale,
      })
    })
  }

  return (
    <div className="pr-4">
      <ButtonGroup>
        {config &&
          config.base.supportedLanguages.map(({ label, lang, name }) => (
            <LinkButton
              inline
              pressed={lang === locale}
              lang={lang}
              aria-label={label}
              key={lang}
              disabled={isPending || lang === locale}
              onClick={() => onLanguageChange(lang)}
            >
              {name}
            </LinkButton>
          ))}
      </ButtonGroup>
    </div>
  )
}

const LanguageSwitch = () => <LanguageSwitchInner />

export { LanguageSwitch }
