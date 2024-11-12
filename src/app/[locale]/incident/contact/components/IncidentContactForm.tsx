'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { steps, useRouter } from '@/routing/navigation'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import validator from 'validator'
import { useFormStore } from '@/store/form_store'
import { useEffect, useRef } from 'react'
import {
  Fieldset,
  FieldsetLegend,
  FormFieldCheckbox,
  FormFieldDescription,
  FormFieldTextbox,
  Heading,
  Paragraph,
} from '@/components/index'
import { FormStep } from '@/types/form'

const IncidentContactForm = () => {
  const t = useTranslations('describe-contact.form')
  const tGeneral = useTranslations('general.describe_form')
  const { updateForm, formState } = useFormStore()
  const {
    addOneStep,
    navToSummary,
    setNavToSummary,
    goToStep,
    addVisitedStep,
    goBack,
    setGoBack,
    setForm,
    setFormRef,
  } = useStepperStore()
  const router = useRouter()

  useEffect(() => {
    router.prefetch('/incident/summary')
  }, [router])

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // @ts-ignore
    setForm(form)
    setFormRef(formRef)
  }, [])

  const incidentContactFormSchema = z.object({
    phone: z
      .string()
      .refine(
        (value) => value == '' || validator.isMobilePhone(value),
        t('errors.number_not_valid')
      )
      .nullable()
      .optional(),
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

    // addVisitedStep(FormStep.STEP_3_CONTACT)
    // addOneStep()
    //
    // router.push(steps[FormStep.STEP_4_SUMMARY])
  }

  useEffect(() => {
    if (navToSummary) {
      updateForm({
        ...formState,
        email: form.getValues('email'),
        phone: form.getValues('phone'),
        sharing_allowed: form.getValues('sharing_allowed'),
      })

      goToStep(FormStep.STEP_4_SUMMARY)
      router.push(steps[FormStep.STEP_4_SUMMARY])
      setNavToSummary(false)
    }
  }, [navToSummary])

  useEffect(() => {
    if (goBack) {
      updateForm({
        ...formState,
        email: form.getValues('email'),
        phone: form.getValues('phone'),
        sharing_allowed: form.getValues('sharing_allowed'),
      })

      goToStep(FormStep.STEP_2_ADD)
      router.push(steps[FormStep.STEP_2_ADD])
      setGoBack(false)
    }
  }, [goBack])

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Heading level={2}>{t('heading')}</Heading>
        <Paragraph>{t('description')}</Paragraph>
      </div>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        <FormFieldTextbox
          label={`${t('describe_mail_input_heading')} (${t('not_required_short')})`}
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
            <div className="bg-gray-200 w-full p-4">
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
