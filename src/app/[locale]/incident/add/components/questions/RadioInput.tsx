import React from 'react'
import { useTranslations } from 'next-intl'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { RadioGroup } from '@/components/index'

interface RadioGroupProps extends QuestionField {}

export const RadioInput = ({ field }: RadioGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const t = useTranslations('general.errors')

  const errorMessage = errors[field.key]?.message as string

  return (
    <RadioGroup
      label={field.meta.label}
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
    ></RadioGroup>
  )
}
