import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Paragraph } from '@/components/index'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({ field }: CheckboxInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const t = useTranslations('general.errors')

  const errorMessage = errors[field.key]?.message as string

  return (
    <fieldset aria-invalid={!!errorMessage} data-testid="checkbox-group">
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
            {...register(`${field.key}.${key}`, getValidators(field, t))}
            type="checkbox"
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
