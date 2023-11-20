'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/Form'

const IncidentContactForm = () => {
  const t = useTranslations('describe-contact.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

  const incidentContactFormSchema = z.object({})

  const form = useForm<z.infer<typeof incidentContactFormSchema>>({
    resolver: zodResolver(incidentContactFormSchema),
    defaultValues: {},
  })

  const onSubmit = (values: z.infer<typeof incidentContactFormSchema>) => {
    setLastCompletedStep(3)
    addOneStep()

    router.push('/incident/summary')
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 items-start"
        >
          <div className="flex flex-col gap-4">
            <h2>{t('heading')}</h2>
            <p>{t('description')}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2>{t('send_to_other_instance_heading')}</h2>
            <p>{t('send_to_other_instance_description')}</p>
          </div>
          <IncidentFormFooter />
        </form>
      </Form>
    </div>
  )
}

export { IncidentContactForm }
