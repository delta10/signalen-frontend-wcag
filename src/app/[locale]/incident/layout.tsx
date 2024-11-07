import { Layout } from '@/types/layout'
import { Stepper } from '@/app/[locale]/incident/components/Stepper'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import pick from 'lodash/pick'

export default function IncidentLayout({ children }: Layout) {
  const messages = useMessages()

  return (
    <main className="p-8">
      <div className="max-w-4xl mx-auto gap-16 grid grid-cols-1 md:grid-cols-12">
        <div className="col-span-1 md:col-span-4">
          <NextIntlClientProvider messages={pick(messages, 'stepper')}>
            <Stepper />
          </NextIntlClientProvider>
        </div>
        <NextIntlClientProvider messages={messages}>
          <div className="col-span-1 md:col-span-8">{children}</div>
        </NextIntlClientProvider>
      </div>
    </main>
  )
}
