'use client'

import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Textarea } from '@/components/ui/TextArea'
import { Input } from '@/components/ui/Input'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

  const incidentDescriptionFormSchema = z.object({
    description: z.string().min(1, t('errors.textarea_required')),
    files: z.any(),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: signal.text,
    },
  })

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    updateSignal({
      ...signal,
      text: values.description,
    })

    setLastCompletedStep(1)
    addOneStep()

    router.push('/incident/add')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        <FormField
          name={'description'}
          control={form.control}
          render={({ field, formState: { errors } }) => (
            <FormItem error={errors.description}>
              <div>
                <FormLabel>{t('describe_textarea_heading')}</FormLabel>
                <FormDescription>
                  {t('describe_textarea_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name={'files'}
          control={form.control}
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <div>
                <FormLabel>{t('describe_upload_heading')}</FormLabel>
                <FormDescription>
                  {t('describe_upload_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                <Input type="file" value="" />
              </FormControl>
            </FormItem>
          )}
        />
        <IncidentFormFooter />
      </form>
    </Form>
  )
}
