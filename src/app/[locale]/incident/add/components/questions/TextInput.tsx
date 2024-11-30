import { QuestionField } from '@/types/form'
import React from 'react'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { FormFieldTextbox } from '@/components'

interface TextInputProps extends QuestionField {}

export const TextInput = ({ field }: TextInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const tError = useTranslations('general.errors')
  const tForm = useTranslations('general.form')
  const errorMessage = errors[field.key]?.message as string

  /* TODO: Implement not required for label */
  return (
    <FormFieldTextbox
      {...register(field.key, getValidators(field, tError))}
      label={`${field.meta.label} ${field.required ? `(${tForm('required_short')})` : `(${tForm('not_required_short')})`}`}
      required={field.required}
      id={`${field.key}`}
      errorMessage={errorMessage}
      placeholder={field.meta.placeholder ? field.meta.placeholder : ''}
      invalid={Boolean(errorMessage)}
      description={field.meta.subtitle}
    />
  )
}
