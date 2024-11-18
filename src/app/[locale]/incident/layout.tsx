import { Layout } from '@/types/layout'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import pick from 'lodash/pick'
import FormProgress from '@/app/[locale]/components/FormProgress'

export default function IncidentLayout({ children }: Layout) {
  const messages = useMessages()

  return (
    <main className="py-8 flex-auto bg-white">
      <div className="max-w-3xl mx-auto gap-16 flex flex-col">
        <div className="">
          <NextIntlClientProvider messages={pick(messages, 'stepper')}>
            <FormProgress />
          </NextIntlClientProvider>
        </div>
        <NextIntlClientProvider messages={messages}>
          <div className="col-span-1 md:col-span-8">{children}</div>
        </NextIntlClientProvider>
      </div>
    </main>
  )
}
