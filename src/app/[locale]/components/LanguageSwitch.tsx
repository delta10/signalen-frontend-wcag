import { ButtonGroup, LinkButton } from '@/components'
import { useLocale } from 'next-intl'
import { useMemo } from 'react'
import { useTransition } from 'react'
import { usePathname, useRouter } from '@/routing/navigation'

const LanguageSwitch = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const onLanguageChange = (locale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: locale })
    })
  }

  const languageSwitchItems = useMemo(() => {
    return {
      items: [
        {
          label: 'This page in English',
          lang: 'en',
          current: locale === 'en',
          textContent: 'EN',
        },
        {
          label: 'Deze pagina in het Nederlands',
          lang: 'nl',
          current: locale === 'nl',
          textContent: 'NL',
        },
      ],
    }
  }, [locale])

  return (
    <div className="pr-4">
      <ButtonGroup>
        {languageSwitchItems.items.map(
          ({ current, label, lang, textContent }) => (
            <LinkButton
              inline
              pressed={current}
              lang={lang}
              aria-label={label}
              key={lang}
              disabled={isPending}
              onClick={() => onLanguageChange(lang)}
            >
              {textContent}
            </LinkButton>
          )
        )}
      </ButtonGroup>
    </div>
  )
}

export { LanguageSwitch }
