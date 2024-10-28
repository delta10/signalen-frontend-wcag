import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { Paragraph } from '../../../../../../components/index'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({
  field,
  register,
  errors,
}: CheckboxInputProps) => {
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()

  const errorMessage = errors[field.key]?.message as string

  // Check if the user has already answered a specific question.
  // Returns true if an answer exists where the id is same as the value key.
  // This is used to determine if the 'defaultChecked' property of a checkbox input should be set.
  const getDefaultValueCheckboxInput = (id: string, key: string) => {
    const extraProperties = formState.extra_properties.filter(
      (question) => question.id === id
    )

    if (!extraProperties.length) {
      return false
    }

    if (Array.isArray(extraProperties[0].answer)) {
      return (
        extraProperties[0].answer.filter((answer) => answer?.id === key)
          .length > 0
      )
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
            {...register(`${field.key}.${key}`, getValidators(field, t))}
            type="checkbox"
            id={`${field.key}-${key}`}
            value={key}
            aria-describedby={errorMessage ? `${field.key}-error` : undefined}
            defaultChecked={getDefaultValueCheckboxInput(field.key, key)}
          />
          <label htmlFor={`${field.key}-${key}`}>
            {field.meta.values[key]}
          </label>
        </div>
      ))}
    </fieldset>
  )
}
