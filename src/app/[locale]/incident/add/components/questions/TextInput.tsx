import { QuestionField } from '@/types/form'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { Paragraph } from '@/components/index'

interface TextInputProps extends QuestionField {}

export const TextInput = ({ field, register, errors }: TextInputProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { watch, setValue } = useFormContext()
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()
  const errorMessage = errors[field.key]?.message as string

  const watchValues = watch()

  // Memoize `evaluateConditions` result to prevent unnecessary updates
  const shouldRenderResult = useMemo(
    () => evaluateConditions(field.meta, watchValues),
    [field.meta, watchValues]
  )

  // Handle visibility changes
  useEffect(() => {
    if (shouldRender !== shouldRenderResult) {
      setShouldRender(shouldRenderResult)
      if (!shouldRenderResult) {
        setValue(field.key, null)
      } else {
        const defaultValue = getDefaultValueTextInput(field.key)
        if (defaultValue) {
          setValue(field.key, defaultValue)
        }
      }
    }
  }, [shouldRenderResult, shouldRender, field.key, setValue])

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

  // Register the field immediately with initial value
  useEffect(() => {
    const defaultValue = getDefaultValueTextInput(field.key)
    if (defaultValue && shouldRender) {
      setValue(field.key, defaultValue)
    }
  }, [field.key, setValue, shouldRender])

  if (!shouldRender) {
    return null
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
      <input
        {...register(field.key, getValidators(field, t))}
        type="text"
        placeholder={field.meta.placeholder ? field.meta.placeholder : ''}
        id={`${field.key}`}
        aria-describedby={
          field.meta.subtitle ? `${field.key}-${field.key}` : ''
        }
      />
    </div>
  )
}
