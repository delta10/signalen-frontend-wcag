import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'

import messagesEN from '../translations/en.json'
import messagesNL from '../translations/nl.json'
import { I18nConfig } from '@/types/i18n'

// Validate the message JSONs against the TypeScript definition
export const messagesJsonEN: I18nConfig = messagesEN
export const messagesJsonNL: I18nConfig = messagesNL

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
