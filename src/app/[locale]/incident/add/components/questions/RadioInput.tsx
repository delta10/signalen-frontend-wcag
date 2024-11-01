import React from 'react'
import { useTranslations } from 'next-intl'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { Paragraph } from '@/components/index'

interface RadioGroupProps extends QuestionField {}

export const RadioInput = ({ field }: RadioGroupProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext()
  const t = useTranslations('general.errors')

  const errorMessage = errors[field.key]?.message as string

  return (
    <fieldset aria-invalid={!!errorMessage} role="radiogroup">
      <legend>
        {field.meta.label}{' '}
        <span> {field.required ? '' : `(${t('not_required_short')})`}</span>
        {field.meta.subtitle && <span>{field.meta.subtitle}</span>}
      </legend>

      {errorMessage && (
        <Paragraph
          id={`${field.key}-error`}
          aria-live="assertive"
          style={{ color: 'red' }}
        >
          {errorMessage}
        </Paragraph>
      )}

      {Object.keys(field.meta.values).map((key: string) => (
        <div key={key}>
          <input
            {...register(field.key, {
              ...getValidators(field, t),
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
