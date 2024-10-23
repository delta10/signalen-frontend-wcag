'use client'

import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'

import { FormFieldTextarea } from '@utrecht/component-library-react/dist/css-module'
import { FileInput, Label } from '@amsterdam/design-system-react'

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
            <FormFieldTextarea
              rows={5}
              description={t('describe_textarea_description')}
              label={t('describe_textarea_heading')}
              errorMessage={errors.description?.message}
              invalid={Boolean(errors.description?.message)}
              {...field}
            />
          )}
        />

        <FormField
          name={'files'}
          control={form.control}
          render={({ field, formState: { errors } }) => (
            <FormItem>
              <div>
                <Label>{t('describe_upload_heading')}</Label>
                <FormDescription>
                  {t('describe_upload_description')}
                </FormDescription>
                <FormMessage />
              </div>
              <FormControl>
                {/* TODO: put onChange handler on file upload, or provide defaultValue (bind to react-hook-form). To prevent error */}
                <FileInput
                  type="file"
                  value=""
                  onChange={() => 'test'}
                  multiple
                />
              </FormControl>
            </FormItem>
          )}
        />
        <IncidentFormFooter />
      </form>
    </Form>
  )
}
