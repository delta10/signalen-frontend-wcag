import React from 'react'
import { PublicQuestionSerializerDetail } from '@/services/client'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { useTranslations } from 'next-intl'

type RadioGroupProps = {
  field: PublicQuestionSerializerDetail
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
}

export const RadioGroup = ({ field, register, errors }: RadioGroupProps) => {
  const t = useTranslations('general.errors')

  const errorMessage = errors[field.key]?.message as string

  return (
    <fieldset aria-invalid={!!errorMessage}>
      <legend>{field.meta.label}</legend>

      {errorMessage && (
        <p
          id={`${field.key}-error`}
          aria-live="assertive"
          style={{ color: 'red' }}
        >
          {errorMessage}
        </p>
      )}

      {Object.keys(field.meta.values).map((key: string) => (
        <div key={key}>
          <input
            {...register(field.key, {
              required: field.required ? t('required') : false,
            })}
            type="radio"
            id={`${field.key}-${key}`}
            value={key}
            aria-describedby={errorMessage ? `${field.key}-error` : undefined}
          />
          <label htmlFor={`${field.key}-${key}`}>
            {field.meta.values[key]}
          </label>
        </div>
      ))}
    </fieldset>
  )
}
