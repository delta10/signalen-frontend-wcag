import { QuestionField } from '@/types/form'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { getValidators } from '@/lib/utils/form-validator'

interface TextInputProps extends QuestionField {}

export const TextInput = ({ field, register, errors }: TextInputProps) => {
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()
  const errorMessage = errors[field.key]?.message as string

  // Check if the user has already answered a specific question.
  // Returns the answer if an answer exists, otherwise returns empty string.
  // This is used to determine if the 'defaultValue' property of a text input should be set.
  const getDefaultValueTextInput = (id: string) => {
    const extraProperties = formState.extra_properties.filter(
      (question) => question.id === id
    )

    if (!extraProperties.length) {
      return ''
    }

    if (typeof extraProperties[0].answer === 'string') {
      return extraProperties[0].answer
    }

    return ''
  }

  return (
    <div className="flex flex-col gap-2">
      {errorMessage && (
        <p
          id={`${field.key}-error`}
          aria-live="assertive"
          style={{ color: 'red' }}
        >
          {errorMessage}
        </p>
      )}
      <label htmlFor={`${field.key}`}>{field.meta.label}</label>
      {field.meta.subtitle && (
        <span id={`${field.key}-${field.key}`}>{field.meta.subtitle}</span>
      )}
      <input
        {...register(field.key, getValidators(field, t))}
        type="text"
        placeholder={field.meta.placeholder ? field.meta.placeholder : ''}
        defaultValue={getDefaultValueTextInput(field.key)}
        id={`${field.key}`}
        aria-describedby={
          field.meta.subtitle ? `${field.key}-${field.key}` : ''
        }
      />
    </div>
  )
}
