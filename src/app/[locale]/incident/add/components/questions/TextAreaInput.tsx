import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormFieldTextarea } from '@/components/index'

interface TextAreaInputProps extends QuestionField {}

export const TextAreaInput = ({ field }: TextAreaInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const tError = useTranslations('general.errors')
  const tForm = useTranslations('general.form')
  const errorMessage = errors[field.key]?.message as string

  /* TODO: implement (not required) for label*/
  return (
    <FormFieldTextarea
      {...register(field.key, getValidators(field, tError))}
      rows={5}
      description={field.meta.subtitle}
      required={field.required}
      id={`${field.key}`}
      label={`${field.meta.label} ${field.required ? `(${tForm('required_short')})` : `(${tForm('not_required_short')})`}`}
      aria-describedby={field.meta.subtitle ? `${field.key}-${field.key}` : ''}
      errorMessage={errorMessage}
      placeholder={field.meta.placeholder ? field.meta.placeholder : ''}
      invalid={Boolean(errorMessage)}
    />
  )
}
