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
  const t = useTranslations('general.errors')
  const errorMessage = errors[field.key]?.message as string

  return (
    <div className="flex flex-col gap-2">
      {/* TODO: implement (not required) for label*/}
      <FormFieldTextarea
        {...register(field.key, getValidators(field, t))}
        rows={5}
        description={field.meta.subtitle}
        required={field.required}
        id={`${field.key}`}
        label={`${field.meta.label} ${field.required ? `(${t('required_short')})` : `(${t('not_required_short')})`}`}
        aria-describedby={
          field.meta.subtitle ? `${field.key}-${field.key}` : ''
        }
        errorMessage={errorMessage}
        placeholder={field.meta.placeholder ? field.meta.placeholder : ''}
        invalid={Boolean(errorMessage)}
      />
    </div>
  )
}
