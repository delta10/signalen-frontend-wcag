'use client'

import React, { useId } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Button,
  Fieldset,
  FieldsetLegend,
  FormFieldDescription,
  FormFieldErrorMessage,
  FormFieldTextarea,
  Heading,
  Paragraph,
} from '@/components'
import {
  ACCEPTED_IMAGE_TYPES,
  FileUpload,
  MAX_FILE_SIZE,
  MIN_FILE_SIZE,
} from '@/components/ui/upload/FileUpload'
import type { QaSessionQuestion } from '@/services/qa-session'

const MAX_ANSWER_LENGTH = 1000

const REPORT_TIMEZONE = 'Europe/Amsterdam'

const formatReportDate = (isoString: string, locale: string): string => {
  const date = new Date(isoString)
  const datePart = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: REPORT_TIMEZONE,
  }).format(date)
  const parts = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: REPORT_TIMEZONE,
  }).formatToParts(date)
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '00'
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00'
  const timePart = locale.startsWith('nl')
    ? `${hour}.${minute} uur`
    : `${hour}:${minute}`
  return `${datePart}, ${timePart}`
}

const createSchema = (questions: QaSessionQuestion[]) =>
  z.object({
    ...questions.reduce(
      (acc, q) => {
        if (q.field_type === 'plain_text' && q.required) {
          acc[q.uuid] = z
            .string()
            .min(1, 'error_required')
            .max(MAX_ANSWER_LENGTH, 'error_max_length')
        } else if (q.field_type === 'plain_text') {
          acc[q.uuid] = z
            .string()
            .max(MAX_ANSWER_LENGTH, 'error_max_length')
            .optional()
        }
        return acc
      },
      {} as Record<string, z.ZodString | z.ZodOptional<z.ZodString>>
    ),
    files: z
      .array(z.instanceof(File))
      .optional()
      .refine(
        (files) =>
          !files || files.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)),
        { message: 'file_type_invalid' }
      )
      .refine(
        (files) => !files || files.every((f) => f.size <= MAX_FILE_SIZE),
        { message: 'file_size_too_large' }
      )
      .refine(
        (files) => !files || files.every((f) => f.size >= MIN_FILE_SIZE),
        { message: 'file_size_too_small' }
      ),
  })

interface QuestionTextareaProps {
  question: QaSessionQuestion
  errors: Record<string, { message?: string }>
  register: ReturnType<typeof useForm>['register']
  getErrorMessage: (key: string, maxLength?: number) => string
  watchValue: string
}

const DUTCH_QUESTION_LABEL = 'Onze vraag aan u'

const QuestionTextarea = ({
  question,
  errors,
  register,
  getErrorMessage,
  watchValue,
}: QuestionTextareaProps) => {
  const t = useTranslations('extra_information')
  const tGeneral = useTranslations('general.form')
  const charCount = (watchValue ?? '').length
  const apiLabel = question.short_label || question.label
  const label =
    apiLabel === DUTCH_QUESTION_LABEL
      ? t('question_label_our_question')
      : apiLabel

  return (
    <div className="w-full">
      <FormFieldTextarea
        className="w-full [&_textarea]:whitespace-pre-wrap"
        id={question.uuid}
        label={<span className="whitespace-pre-wrap">{label}</span>}
        rows={5}
        maxLength={MAX_ANSWER_LENGTH}
        description={
          question.label !== question.short_label ? (
            <span className="whitespace-pre-wrap">{question.label}</span>
          ) : undefined
        }
        invalid={Boolean(errors[question.uuid])}
        errorMessage={
          errors[question.uuid]
            ? getErrorMessage(
                errors[question.uuid]?.message ?? '',
                MAX_ANSWER_LENGTH
              )
            : undefined
        }
        required={question.required}
        {...register(question.uuid)}
      />
      <Paragraph className="text-sm mt-1">
        {tGeneral('characters_count', {
          current: charCount,
          max: MAX_ANSWER_LENGTH,
        })}
      </Paragraph>
    </div>
  )
}

interface ExtraInformationFormProps {
  questions: QaSessionQuestion[]
  signalNumber: number
  createdAt: string
  onSubmit: (data: {
    answers: Record<string, string>
    files?: File[]
  }) => Promise<void>
  maxFiles?: number
  showFileUpload?: boolean
}

export const ExtraInformationForm = ({
  questions,
  signalNumber,
  createdAt,
  onSubmit,
  maxFiles,
  showFileUpload = false,
}: ExtraInformationFormProps) => {
  const t = useTranslations('extra_information')
  const tDescribe = useTranslations('describe_report.form.errors')
  const tGeneral = useTranslations('general.form')
  const locale = useLocale()
  const descriptionId = useId()
  const errorMessageId = useId()

  const plainTextQuestions = questions.filter(
    (q) => q.field_type === 'plain_text'
  )
  const schema = createSchema(plainTextQuestions)

  type FormData = z.infer<typeof schema>

  const defaultValues = plainTextQuestions.reduce(
    (acc, q) => {
      acc[q.uuid] = ''
      return acc
    },
    { files: [] } as Record<string, string | File[]>
  )

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const watchedValues = useWatch({ control })

  const getErrorMessage = (key: string, maxLength?: number) => {
    if (key === 'error_required') return t('error_required')
    if (key === 'error_max_length')
      return tGeneral('max_length', {
        maxLength: maxLength ?? MAX_ANSWER_LENGTH,
      })
    if (key === 'file_type_invalid') return tDescribe('file_type_invalid')
    if (key === 'file_size_too_large') return tDescribe('file_size_too_large')
    if (key === 'file_size_too_small') return tDescribe('file_size_too_small')
    return key
  }

  const onFormSubmit = async (values: FormData) => {
    const answers: Record<string, string> = {}
    for (const q of plainTextQuestions) {
      const val = values[q.uuid as keyof FormData] as string | undefined
      if (typeof val === 'string' && val.trim()) {
        answers[q.uuid] = val.trim()
      }
    }
    await onSubmit({
      answers,
      files: values.files && values.files.length > 0 ? values.files : undefined,
    })
  }

  const formattedDate = formatReportDate(createdAt, locale)

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-6 items-start"
        noValidate
      >
        <section aria-labelledby="report-info-heading">
          <Heading id="report-info-heading" level={2}>
            {t('your_report')}
          </Heading>
          <Paragraph>
            {t('report_number', { number: `SIG-${signalNumber}` })}
          </Paragraph>
          <Paragraph>{t('reported_on', { date: formattedDate })}</Paragraph>
        </section>

        {plainTextQuestions.map((question) => (
          <QuestionTextarea
            key={question.uuid}
            question={question}
            errors={errors as Record<string, { message?: string }>}
            register={register}
            getErrorMessage={getErrorMessage}
            watchValue={
              (watchedValues as Record<string, string>)?.[question.uuid] ?? ''
            }
          />
        ))}

        {showFileUpload && (
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
                {getErrorMessage(
                  (errors.files as { message?: string })?.message ?? ''
                )}
              </FormFieldErrorMessage>
            )}
            <FileUpload maxFiles={maxFiles} />
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
