'use client'

import React, { useId } from 'react'
import { useTranslations } from 'next-intl'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Button,
  Fieldset,
  FieldsetLegend,
  FormFieldCheckbox,
  FormFieldDescription,
  FormFieldErrorMessage,
  FormFieldTextarea,
} from '@/components'
import { RadioGroupNLDS } from '@/components/ui/RadioGroupNLDS'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'
import type { KtoOption } from '@/services/feedback'

const EXTRA_TEXT_MAX_LENGTH = 1000
const KTO_MAX_FILES = 3

interface KtoFormProps {
  answer: 'ja' | 'nee'
  options: KtoOption[]
  onSubmit: (data: {
    text_list: string[]
    text_extra?: string
    allows_contact?: boolean
    files?: File[]
  }) => Promise<void>
}

const createSchema = (isNotSatisfied: boolean) =>
  z.object({
    text_list: z
      .array(z.string())
      .min(1, 'error_required')
      .refine((arr) => arr.length > 0 && arr[0] !== '', 'error_required'),
    text_extra: z
      .string()
      .max(EXTRA_TEXT_MAX_LENGTH, 'error_max_length')
      .optional(),
    allows_contact: z.boolean().optional(),
    files: isNotSatisfied
      ? z
          .array(z.instanceof(File))
          .optional()
          .refine(
            (files) =>
              !files ||
              files.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)),
            { message: 'file_type_invalid' }
          )
          .refine(
            (files) => !files || files.every((f) => f.size <= MAX_FILE_SIZE),
            { message: 'file_size_too_large' }
          )
          .refine(
            (files) => !files || files.every((f) => f.size >= MIN_FILE_SIZE),
            { message: 'file_size_too_small' }
          )
      : z.array(z.any()).optional(),
  })

export function KtoForm({ answer, options, onSubmit }: KtoFormProps) {
  const t = useTranslations('kto')
  const tDescribe = useTranslations('describe_report.form.errors')
  const tGeneral = useTranslations('general.form')
  const isNotSatisfied = answer === 'nee'
  const descriptionId = useId()
  const errorMessageId = useId()
  const allowsContactDescriptionId = useId()

  const schema = createSchema(isNotSatisfied)

  type FormData = z.infer<typeof schema>

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      text_list: [],
      text_extra: '',
      allows_contact: false,
      files: [],
    },
  })

  const {
    register,
    setValue,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const textExtra =
    useWatch({ control, name: 'text_extra', defaultValue: '' }) ?? ''
  const selectedReason = useWatch({ control, name: 'text_list' })?.[0]

  const getErrorMessage = (key: string) => {
    if (key === 'error_required') return t('error_required')
    if (key === 'error_max_length')
      return tGeneral('max_length', { maxLength: EXTRA_TEXT_MAX_LENGTH })
    if (key === 'file_type_invalid') return tDescribe('file_type_invalid')
    if (key === 'file_size_too_large') return tDescribe('file_size_too_large')
    if (key === 'file_size_too_small') return tDescribe('file_size_too_small')
    return key
  }

  const onFormSubmit = async (values: FormData) => {
    await onSubmit({
      text_list: values.text_list,
      text_extra: values.text_extra || undefined,
      allows_contact: isNotSatisfied ? values.allows_contact : undefined,
      files: isNotSatisfied && values.files?.length ? values.files : undefined,
    })
  }

  const reasonQuestion = isNotSatisfied
    ? t('reason_question_nee')
    : t('reason_question_ja')

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-6 items-start"
        noValidate
      >
        <RadioGroupNLDS
          name="reason"
          label={reasonQuestion}
          description={t('choose_one')}
          required
          invalid={Boolean(errors.text_list)}
          errorMessage={
            errors.text_list
              ? getErrorMessage(errors.text_list.message ?? '')
              : undefined
          }
          options={options.map((opt, i) => ({
            value: opt.value,
            label: opt.text,
            id: `reason-${i}`,
            checked: selectedReason === opt.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue('text_list', [e.target.value], {
                shouldValidate: true,
              })
            },
          }))}
        />

        {isNotSatisfied && (
          <Fieldset
            invalid={Boolean(errors.files)}
            aria-describedby={
              errors.files
                ? `${descriptionId} ${errorMessageId}`
                : descriptionId
            }
          >
            <FieldsetLegend>{t('optional_photos')}</FieldsetLegend>
            <FormFieldDescription id={descriptionId}>
              {t('photos_help')}
            </FormFieldDescription>
            {errors.files && (
              <FormFieldErrorMessage id={errorMessageId}>
                {getErrorMessage(errors.files.message ?? '')}
              </FormFieldErrorMessage>
            )}
            <FileUpload maxFiles={KTO_MAX_FILES} />
          </Fieldset>
        )}

        <FormFieldTextarea
          id="text_extra"
          label={t('optional_comment')}
          rows={5}
          maxLength={EXTRA_TEXT_MAX_LENGTH}
          description={tGeneral('characters_count', {
            current: (textExtra ?? '').length,
            max: EXTRA_TEXT_MAX_LENGTH,
          })}
          invalid={Boolean(errors.text_extra)}
          errorMessage={
            errors.text_extra
              ? getErrorMessage(errors.text_extra.message ?? '')
              : undefined
          }
          {...register('text_extra')}
        />

        {isNotSatisfied && (
          <Fieldset aria-describedby={allowsContactDescriptionId}>
            <FieldsetLegend>{t('contact_heading')}</FieldsetLegend>
            <FormFieldDescription id={allowsContactDescriptionId}>
              {t('contact_permission')}
            </FormFieldDescription>
            <div className="flex flex-col mt-3 w-full">
              <FormFieldCheckbox
                label={t('contact_checkbox_label')}
                errorMessage={errors.allows_contact?.message}
                invalid={Boolean(errors.allows_contact?.message)}
                {...register('allows_contact')}
              />
            </div>
          </Fieldset>
        )}

        <Button type="submit" purpose="primary" disabled={isSubmitting}>
          {isSubmitting
            ? tGeneral('submit_button') + '...'
            : tGeneral('submit_button')}
        </Button>
      </form>
    </FormProvider>
  )
}
