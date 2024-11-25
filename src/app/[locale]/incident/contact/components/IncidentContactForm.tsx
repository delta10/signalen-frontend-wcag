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
  Fieldset,
  FieldsetLegend,
  FormFieldCheckbox,
  FormFieldDescription,
  FormFieldTextbox,
  Heading,
  Paragraph,
} from '@/components/index'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'

const IncidentContactForm = () => {
  const t = useTranslations('describe-contact.form')
  const { updateForm, formState } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)

  useEffect(() => {
    router.prefetch('/incident/summary')
  }, [router])

  const incidentContactFormSchema = z.object({
    phone: z
      .string()
      .nullable()
      .optional()
      .refine(
        (value) => !value || value.length <= 17,
        t('errors.number_exceeds_max_characters')
      )
      .refine(
        (value) => !value || RegExp('^[ ()0-9+-]*$').test(value),
        t('errors.number_invalid_character')
      ),
    email: z
      .string()
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
    defaultValues: {
      phone: formState.phone,
      email: formState.email,
      sharing_allowed: formState.sharing_allowed,
    },
  })

  const onSubmit = () => {
    updateForm({
      ...formState,
      email: form.getValues('email'),
      phone: form.getValues('phone'),
      sharing_allowed: form.getValues('sharing_allowed'),
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Heading level={2}>{t('heading')}</Heading>
        <Paragraph>{t('description')}</Paragraph>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        <FormFieldTextbox
          label={`${t('describe_phone_input_heading')} (${t('not_required_short')})`}
          autoComplete="phone"
          errorMessage={form.formState.errors.phone?.message}
          invalid={Boolean(form.formState.errors.phone?.message)}
          required={false}
          {...form.register('phone')}
        />
        <FormFieldTextbox
          label={`${t('describe_mail_input_heading')} (${t('not_required_short')})`}
          type="email"
          autoComplete="email"
          errorMessage={form.formState.errors.email?.message}
          invalid={Boolean(form.formState.errors.email?.message)}
          required={false}
          {...form.register('email')}
        />
        <Fieldset aria-describedby="todo-id">
          <FieldsetLegend>
            <Heading level={2}>{t('send_to_other_instance_heading')}</Heading>
          </FieldsetLegend>
          <div className="flex flex-col gap-4">
            <FormFieldDescription id="todo-id">
              <Paragraph>{t('send_to_other_instance_description')}</Paragraph>
            </FormFieldDescription>
            <div className="w-full p-4 background-gray-200">
              <FormFieldCheckbox
                label={t('describe_checkbox_input_description')}
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
