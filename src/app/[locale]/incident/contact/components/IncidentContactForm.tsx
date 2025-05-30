'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/routing/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import validator from 'validator'
import { useFormStore } from '@/store/form_store'
import { useEffect } from 'react'
import {
  Alert,
  Fieldset,
  FieldsetLegend,
  FormFieldCheckbox,
  FormFieldDescription,
  FormFieldTextbox,
  Heading,
  Link,
  Paragraph,
} from '@/components/index'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'
import { useConfig } from '@/contexts/ConfigContext'

const IncidentContactForm = () => {
  const t = useTranslations('describe_contact.form')
  const tGeneral = useTranslations('general')
  const { updateForm, formState } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)
  const MAX_LENGTH_PHONE_NUMBER = 17
  const config = useConfig()

  useEffect(() => {
    router.prefetch('/incident/summary')
  }, [router])

  const incidentContactFormSchema = z.object({
    phone: z
      .string()
      .trim()
      .nullable()
      .optional()
      .refine(
        (value) => !value || value.length < MAX_LENGTH_PHONE_NUMBER,
        t('errors.number_exceeds_max_characters', {
          maxLength: MAX_LENGTH_PHONE_NUMBER,
        })
      )
      .refine(
        (value) => !value || RegExp('^[ ()0-9+-]*$').test(value),
        t('errors.number_invalid_character')
      ),
    email: z
      .string()
      .trim()
      .refine(
        (value) => value == '' || validator.isEmail(value),
        t('errors.email_not_valid')
      )
      .nullable()
      .optional(),
    sharing_allowed: z.boolean(),
  })

  const form = useForm<z.infer<typeof incidentContactFormSchema>>({
    resolver: zodResolver(incidentContactFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      phone: formState.phone,
      email: formState.email,
      sharing_allowed: formState.sharing_allowed,
    },
  })

  const onSubmit = () => {
    updateForm({
      ...formState,
      email: form.getValues('email')?.trim(),
      phone: form.getValues('phone')?.trim(),
      sharing_allowed: form.getValues('sharing_allowed'),
      last_completed_step: Math.max(formState.last_completed_step, step),
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  return (
    <div>
      <Alert className="sr-only">
        <Paragraph>{`${t('alert_no_required_fields')} `}</Paragraph>
      </Alert>
      <div className="mt-8">
        <Heading level={2}>{t('heading')}</Heading>
        <Paragraph className="contact-paragraph">{t('description')}</Paragraph>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start mt-4"
      >
        <FormFieldTextbox
          label={`${t('describe_phone_input_heading')} (${tGeneral('form.not_required_short')})`}
          autoComplete="tel"
          errorMessage={form.formState.errors.phone?.message}
          invalid={Boolean(form.formState.errors.phone?.message)}
          required={false}
          {...form.register('phone')}
        />
        <FormFieldTextbox
          label={`${t('describe_mail_input_heading')} (${tGeneral('form.not_required_short')})`}
          autoComplete="email"
          errorMessage={form.formState.errors.email?.message}
          invalid={Boolean(form.formState.errors.email?.message)}
          required={false}
          {...form.register('email')}
        />
        <Fieldset aria-describedby="todo-id">
          <FieldsetLegend>
            <Heading level={2}>
              {t('send_to_other_instance_heading')} (
              {tGeneral('form.not_required_short')})
            </Heading>
            <FormFieldDescription id="todo-id">
              {t('send_to_other_instance_description')}
            </FormFieldDescription>
          </FieldsetLegend>
          <div className="flex flex-col">
            <div className="w-full">
              <FormFieldCheckbox
                label={t('describe_checkbox_input_description', {
                  organization: config?.base.municipality_display_name,
                })}
                errorMessage={form.formState.errors.sharing_allowed?.message}
                invalid={Boolean(
                  form.formState.errors.sharing_allowed?.message
                )}
                {...form.register('sharing_allowed')}
              ></FormFieldCheckbox>
            </div>
          </div>
        </Fieldset>
        <IncidentFormFooter />
      </form>
    </div>
  )
}

export { IncidentContactForm }
