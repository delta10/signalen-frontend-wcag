import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CheckboxGroup } from '@/components/index'
import type { FocusEvent } from 'react'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({ field }: CheckboxInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const tError = useTranslations('general.errors')
  const tForm = useTranslations('general.form')

  const errorMessage = errors[field.key]?.message as string

  return (
    <CheckboxGroup
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
          onFocus: (evt: FocusEvent<HTMLInputElement>) => {
            const label = evt.target.closest('label')
            if (label) {
              label.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
              })
            }
          },
        }
      })}
      invalid={Boolean(errorMessage)}
      errorMessage={errorMessage}
      description={field.meta.subtitle}
    ></CheckboxGroup>
  )
}
