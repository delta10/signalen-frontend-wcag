'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { useSignalStore, useStepperStore } from '@/store/store'
import { useRouter } from '@/routing/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import validator from 'validator'
import { Textarea } from '@/components/ui/TextArea'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'

const IncidentContactForm = () => {
  const t = useTranslations('describe-contact.form')
  const { updateSignal, signal } = useSignalStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

  const incidentContactFormSchema = z.object({
    phone: z
      .string()
      .refine(validator.isMobilePhone, t('errors.number_not_valid'))
      .optional()
      .nullable(),
    email: z.string().email(t('errors.email_not_valid')).optional().nullable(),
    sharing_allowed: z.boolean().optional(),
  })

  const form = useForm<z.infer<typeof incidentContactFormSchema>>({
    resolver: zodResolver(incidentContactFormSchema),
    defaultValues: {
      phone: signal.reporter.phone,
      email: signal.reporter.email,
      sharing_allowed: signal.reporter.sharing_allowed,
    },
  })

  const onSubmit = (values: z.infer<typeof incidentContactFormSchema>) => {
    updateSignal({
      ...signal,
      reporter: {
        ...signal.reporter,
        email: values.email,
        phone: values.phone,
        sharing_allowed: values.sharing_allowed,
      },
    })

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
          <FormField
            name={'phone'}
            control={form.control}
            render={({ field, formState: { errors } }) => (
              <FormItem error={errors.phone}>
                <div>
                  <FormLabel>{t('describe_phone_input_heading')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input {...field} value={field.value!} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name={'email'}
            control={form.control}
            render={({ field, formState: { errors } }) => (
              <FormItem error={errors.email}>
                <div>
                  <FormLabel>{t('describe_mail_input_heading')}</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input {...field} value={field.value!} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <h2>{t('send_to_other_instance_heading')}</h2>
            <p>{t('send_to_other_instance_description')}</p>
          </div>
          <div className="bg-gray-200 w-full flex flex-row gap-4 p-4">
            <FormField
              name={'sharing_allowed'}
              control={form.control}
              render={({ field, formState: { errors } }) => (
                <FormItem error={errors.sharing_allowed}>
                  <FormControl>
                    <Checkbox
                      {...field}
                      checked={field.value}
                      value={undefined}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <p>{t('describe_checkbox_input_description')}</p>
          </div>
          <IncidentFormFooter />
        </form>
      </Form>
    </div>
  )
}

export { IncidentContactForm }
