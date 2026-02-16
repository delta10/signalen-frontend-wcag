import { ButtonGroup, LinkButton } from '@/components'
import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/routing/navigation'
import { useConfig } from '@/contexts/ConfigContext'

const LanguageSwitch = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const config = useConfig()
  const [isPending, startTransition] = useTransition()

  const onLanguageChange = (locale: string) => {
    startTransition(() => {
      // pathname can include dynamic routes (e.g. KTO) - router accepts current path at runtime
      router.replace(pathname as Parameters<typeof router.replace>[0], {
        locale: locale,
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

export { LanguageSwitch }
