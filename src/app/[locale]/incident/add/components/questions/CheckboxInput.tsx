import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckboxGroup } from '@/components/index'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({ field }: CheckboxInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const t = useTranslations('general.errors')

  const errorMessage = errors[field.key]?.message as string

  return (
    <CheckboxGroup
      label={`${field.meta.label} ${field.required ? `(${t('required_short')})` : `(${t('not_required_short')})`}`}
      required={field.required}
      id={`${field.key}`}
      // @ts-ignore
      options={Object.keys(field.meta.values).map((key: string) => {
        return {
          ...register(field.key, {
            ...getValidators(field, t),
          }),
          label: field.meta.values[key],
          value: key,
          id: `${field.key}-${key}`,
        }
      })}
      invalid={Boolean(errorMessage)}
      errorMessage={errorMessage}
      description={field.meta.subtitle}
    ></CheckboxGroup>
  )
}
