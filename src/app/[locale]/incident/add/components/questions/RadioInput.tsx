import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { evaluateConditions } from '@/lib/utils/check-visibility'

interface RadioGroupProps extends QuestionField {}

export const RadioInput = ({ field, register, errors }: RadioGroupProps) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { watch, getValues, resetField } = useFormContext()
  const t = useTranslations('general.errors')
  const { formState } = useFormStore()

  const errorMessage = errors[field.key]?.message as string

  const watchValues = watch()

  // Memoize `evaluateConditions` result to prevent unnecessary updates
  const shouldRenderResult = useMemo(
    () => evaluateConditions(field.meta, watchValues),
    [field.meta, watchValues]
  )

  // Only update `shouldRender` if the result changes
  useEffect(() => {
    if (shouldRender !== shouldRenderResult) {
      setShouldRender(shouldRenderResult)
      resetField(field.key)
    }
  }, [shouldRenderResult, shouldRender])

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
      return extraProperties[0].answer?.id === key
    }

    return false
  }

  if (!shouldRender) {
    return null // Do not render if conditions aren't met
  }

  return (
    <fieldset aria-invalid={!!errorMessage}>
      <legend>
        {field.meta.label}{' '}
        <span> {field.required ? '' : `(${t('not_required_short')})`}</span>
        {field.meta.subtitle && <span>{field.meta.subtitle}</span>}
      </legend>

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
              ...getValidators(field, t),
            })}
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
