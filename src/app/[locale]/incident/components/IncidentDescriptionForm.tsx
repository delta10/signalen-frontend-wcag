'use client'

import * as z from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { usePathname, useRouter } from '@/routing/navigation'
import React, { useEffect, useId } from 'react'
import { getCategoryForDescription } from '@/services/classification'
import { useFormStore } from '@/store/form_store'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'

import {
  Fieldset,
  FieldsetLegend,
  FormFieldDescription,
  FormFieldErrorMessage,
  FormFieldTextarea,
} from '@/components/index'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'
import { getAttachments } from '@/lib/utils/attachments'
import { clsx } from 'clsx'
import useDebounce from '@/hooks/useDebounce'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe_report.form')
  const tGeneral = useTranslations('general')
  const { updateForm, formState } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)
  const descriptionId = useId()
  const errorMessageId = useId()

  useEffect(() => {
    router.prefetch('/incident/add')
  }, [router])

  const incidentDescriptionFormSchema = z.object({
    description: z.string().trim().min(1, t('errors.textarea_required')),
    files: z
      .array(z.instanceof(File))
      .refine(
        (files) =>
          files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
        {
          message: t('errors.file_type_invalid'),
        }
      )
      .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
        message: t('errors.file_size_too_large'),
      })
      .refine((files) => files.every((file) => file.size >= MIN_FILE_SIZE), {
        message: t('errors.file_size_too_small'),
      }),
  })

  const form = useForm<z.infer<typeof incidentDescriptionFormSchema>>({
    resolver: zodResolver(incidentDescriptionFormSchema),
    defaultValues: {
      description: formState.description,
      files: getAttachments(formState.attachments),
    },
  })
  const { register } = form

  const { description } = form.watch()
  const debouncedDescription = useDebounce(description, 100)

  useEffect(() => {
    if (!description) {
      return
    }

    async function fetchCategory() {
      const { main, sub } =
        await getCategoryForDescription(debouncedDescription)

      updateForm({
        ...formState,
        main_category: main,
        sub_category: sub,
      })
    }

    fetchCategory()
  }, [debouncedDescription])

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    updateForm({
      ...formState,
      description: values.description,
      attachments: values.files,
      selectedFeatures:
        values.description !== formState.description
          ? []
          : formState.selectedFeatures,
      last_completed_step: Math.max(formState.last_completed_step, step),
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  const invalidFiles = !!form.formState.errors.files?.message

  // @ts-ignore
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        <FormFieldTextarea
          rows={5}
          description={t('describe_textarea_description')}
          label={`${t('describe_textarea_heading')} (${tGeneral('form.required_short')})`}
          errorMessage={form.formState.errors.description?.message}
          invalid={Boolean(form.formState.errors.description?.message)}
          required={true}
          {...form.register('description')}
        />

        <Fieldset
          invalid={invalidFiles}
          aria-describedby={clsx(descriptionId, {
            [errorMessageId]: invalidFiles,
          })}
        >
          <FieldsetLegend>
            {`${t('describe_textarea_heading')} (${tGeneral('form.not_required_short')})`}
          </FieldsetLegend>
          <FormFieldDescription id={descriptionId}>
            {t('describe_upload_description')}
          </FormFieldDescription>

          {invalidFiles && (
            <FormFieldErrorMessage id={errorMessageId}>
              {form.formState.errors.files?.message}
            </FormFieldErrorMessage>
          )}

          {/* @ts-ignore */}
          <FileUpload {...register('files', { required: false })} />
        </Fieldset>

        <IncidentFormFooter />
      </form>
    </FormProvider>
  )
}
