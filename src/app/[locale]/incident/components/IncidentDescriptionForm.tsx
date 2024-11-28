'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { usePathname, useRouter } from '@/routing/navigation'
import React, { useEffect } from 'react'
import { getCategoryForDescription } from '@/services/classification'
import { debounce } from 'lodash'
import { useFormStore } from '@/store/form_store'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MAX_NUMBER_FILES,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'

import { FormFieldTextarea } from '@/components/index'
import {
  Fieldset,
  FieldsetLegend,
  FormFieldDescription,
  FormFieldErrorMessage,
} from '@/components/index'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'
import { getAttachments } from '@/lib/utils/attachments'

export const IncidentDescriptionForm = () => {
  const t = useTranslations('describe-report.form')
  const { updateForm, formState } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)

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
  const { register, setFocus } = form

  const { description } = form.watch()

  useEffect(() => {
    const debouncedWatch = debounce(async (value) => {
      if (value) {
        const { main, sub } = await getCategoryForDescription(value)

        updateForm({
          ...formState,
          main_category: main,
          sub_category: sub,
        })
      }
    }, 500)

    debouncedWatch(description)

    return () => {
      debouncedWatch.cancel()
    }
  }, [description])

  const onSubmit = (values: z.infer<typeof incidentDescriptionFormSchema>) => {
    updateForm({
      ...formState,
      description: values.description,
      attachments: values.files,
      last_completed_step: Math.max(formState.last_completed_step, step),
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const filesArray = form
        .getValues('files')
        .concat(Array.from(files))
        .slice(0, MAX_NUMBER_FILES)
      form.setValue('files', filesArray)
    }
  }

  const deleteFile = (index: number) => {
    const updatedFiles = form.getValues('files').filter((_, i) => i !== index)
    form.setValue('files', updatedFiles)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-8 items-start"
    >
      <FormFieldTextarea
        rows={5}
        description={t('describe_textarea_description')}
        label={`${t('describe_textarea_heading')} (${t('required_short')})`}
        errorMessage={form.formState.errors.description?.message}
        invalid={Boolean(form.formState.errors.description?.message)}
        required={true}
        {...form.register('description')}
      />

      <Fieldset invalid={Boolean(form.formState.errors.files?.message)}>
        <FieldsetLegend>{`${t('describe_textarea_heading')} (${t('not_required_short')})`}</FieldsetLegend>

        <FormFieldDescription>
          {t('describe_upload_description')}
        </FormFieldDescription>

        {Boolean(form.formState.errors.files?.message) &&
          form.formState.errors.files?.message && (
            <FormFieldErrorMessage>
              {form.formState.errors.files?.message}
            </FormFieldErrorMessage>
          )}

        {/* @ts-ignore */}
        <FileUpload
          onFileUpload={(e) => handleFileChange(e)}
          onDelete={(index) => deleteFile(index)}
          files={form.getValues('files')}
          {...register('files', { required: false })}
        />
      </Fieldset>

      <IncidentFormFooter />
    </form>
  )
}
