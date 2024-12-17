import React from 'react'
import { useTranslations } from 'next-intl'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { RadioGroupNLDS } from '@/components/ui/RadioGroupNLDS'

interface RadioGroupProps extends QuestionField {}

export const RadioInput = ({ field }: RadioGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const tError = useTranslations('general.errors')
  const tForm = useTranslations('general.form')

  const errorMessage = errors[field.key]?.message as string

  return (
    <RadioGroupNLDS
      label={`${field.meta.label} ${field.required ? `(${tForm('required_short')})` : `(${tForm('not_required_short')})`}`}
      required={field.required}
      id={`${field.key}`}
      // @ts-ignore
      options={Object.keys(field.meta.values).map((key: string) => {
        return {
          ...register(field.key, {
            ...getValidators(field, tError),
          }),
          label: field.meta.values[key],
          value: key,
          id: `${field.key}-${key}`,
        }
      })}
      invalid={Boolean(errorMessage)}
      errorMessage={errorMessage}
      description={field.meta.subtitle}
    ></RadioGroupNLDS>
  )
}
