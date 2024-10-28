import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { Paragraph } from '../../../../../../components/index'

interface TextAreaInputProps extends QuestionField {}

export const TextAreaInput = ({
  field,
  register,
  errors,
}: TextAreaInputProps) => {
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()
  const errorMessage = errors[field.key]?.message as string

  // Check if the user has already answered a specific question.
  // Returns the answer if an answer exists, otherwise returns empty string.
  // This is used to determine if the 'defaultValue' property of a textarea input should be set.
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
        <Paragraph
          id={`${field.key}-error`}
          aria-live="assertive"
          style={{ color: 'red' }}
        >
          {errorMessage}
        </Paragraph>
      )}
      <label htmlFor={`${field.key}`}>
        {field.meta.label}{' '}
        <span> {field.required ? '' : `(${t('not_required_short')})`}</span>
      </label>
      {field.meta.subtitle && (
        <span id={`${field.key}-${field.key}`}>{field.meta.subtitle}</span>
      )}
      <textarea
        {...register(field.key, getValidators(field, t))}
        rows={5}
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
