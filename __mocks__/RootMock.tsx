import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'

import messagesEN from '../translations/en.json'
import messagesNL from '../translations/nl.json'

// Validate the message JSONs against the TypeScript definition
// todo: check I18nConfig once we have settled on a more robust language dictionary structure
export const messagesJsonEN: any = messagesEN
export const messagesJsonNL: any = messagesNL

interface Props {
  children: ReactNode
}

export const RootMock = ({ children }: Props) => {
  return (
    <NextIntlClientProvider messages={messagesEN} locale="en">
      {children}
    </NextIntlClientProvider>
  )
}
