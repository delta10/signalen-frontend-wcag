import { ButtonGroup, LinkButton } from '@/components'

const LanguageSwitch = () => {
  const languageSwitchItems = {
    items: [
      {
        label: 'This page in English',
        lang: 'en',
        current: true,
        textContent: 'EN',
      },
      {
        label: 'Deze pagina in Nederlands',
        lang: 'nl',
        current: false,
        textContent: 'NL',
      },
    ],
  }

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
