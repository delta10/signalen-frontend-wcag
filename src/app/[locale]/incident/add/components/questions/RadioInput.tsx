import React from 'react'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { Paragraph } from '@/components/index'

interface RadioGroupProps extends QuestionField {}

export const RadioInput = ({ field, register, errors }: RadioGroupProps) => {
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()

  const errorMessage = errors[field.key]?.message as string

  // Check if the user has already answered a specific question.
  // Returns true if an answer exists, otherwise returns false.
  // This is used to determine if the 'defaultChecked' property of a radio input should be set.
  const getDefaultValueRadioInput = (id: string, key: string) => {
    const extraProperties = formState.extra_properties.filter(
      (question) => question.id === id
    )

    if (!extraProperties.length) {
      return false
    }

    if (typeof extraProperties[0].answer !== 'string') {
      return extraProperties[0].answer.id === key
    }

    return false
  }

  return (
    <fieldset aria-invalid={!!errorMessage}>
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
            {...register(field.key, getValidators(field, t))}
            type="radio"
            id={`${field.key}-${key}`}
            value={key}
            aria-describedby={errorMessage ? `${field.key}-error` : undefined}
            defaultChecked={getDefaultValueRadioInput(field.key, key)}
          />
          <label htmlFor={`${field.key}-${key}`}>
            {field.meta.values[key]}
          </label>
        </div>
      ))}
    </fieldset>
  )
}
