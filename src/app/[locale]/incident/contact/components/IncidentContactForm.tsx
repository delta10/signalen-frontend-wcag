'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import validator from 'validator'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { useFormStore } from '@/store/form_store'
import { useEffect } from 'react'
import { Paragraph, Heading } from '@/components/index'

const IncidentContactForm = () => {
  const t = useTranslations('describe-contact.form')
  const { updateForm, formState } = useFormStore()
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/incident/summary')
  }, [router])

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
      phone: formState.phone,
      email: formState.email,
      sharing_allowed: formState.sharing_allowed,
    },
  })

  const onSubmit = (values: z.infer<typeof incidentContactFormSchema>) => {
    updateForm({
      ...formState,
      email: values.email,
      phone: values.phone,
      sharing_allowed: values.sharing_allowed,
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
            <Heading level={2}>{t('heading')}</Heading>
            <Paragraph>{t('description')}</Paragraph>
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
            <Heading level={2}>{t('send_to_other_instance_heading')}</Heading>
            <Paragraph>{t('send_to_other_instance_description')}</Paragraph>
          </div>
          <div className="bg-gray-200 w-full p-4">
            <FormField
              name={'sharing_allowed'}
              control={form.control}
              render={({ field, formState: { errors } }) => (
                <FormItem
                  error={errors.sharing_allowed}
                  className="flex flex-row gap-4"
                >
                  <FormControl>
                    <Checkbox
                      {...field}
                      checked={field.value}
                      value={undefined}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {t('describe_checkbox_input_description')}
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <IncidentFormFooter />
        </form>
      </Form>
    </div>
  )
}

export { IncidentContactForm }
