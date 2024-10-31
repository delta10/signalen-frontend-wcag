import { NextIntlClientProvider } from 'next-intl'
import { ReactNode } from 'react'

import messages from '../translations/en.json'

interface Props {
  children: ReactNode
}

export const RootMock = ({ children }: Props) => {
  return (
    <NextIntlClientProvider messages={messages} locale="en">
      {children}
    </NextIntlClientProvider>
  )
}
