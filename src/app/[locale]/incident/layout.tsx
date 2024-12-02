import { Layout } from '@/types/layout'
import { NextIntlClientProvider, useMessages } from 'next-intl'

export default function IncidentLayout({ children }: Layout) {
  const messages = useMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="col-span-1 md:col-span-8">{children}</div>
    </NextIntlClientProvider>
  )
}
