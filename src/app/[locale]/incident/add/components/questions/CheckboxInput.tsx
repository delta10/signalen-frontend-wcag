import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { getValidators } from '@/lib/utils/form-validator'
import React, { useEffect, useMemo, useState } from 'react'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { useFormContext } from 'react-hook-form'
import { Paragraph } from '@/components/index'

interface CheckboxInputProps extends QuestionField {}

export const CheckboxInput = ({
  field,
  register,
  errors,
}: CheckboxInputProps) => {
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
        const defaultValue = getDefaultValueCheckboxInput(field.key)
        if (defaultValue) {
          setValue(field.key, defaultValue)
        }
      }
    }
  }, [shouldRenderResult, shouldRender, field.key, setValue])

  // Get default value helper function
  const getDefaultValueCheckboxInput = (id: string) => {
    const extraProperty = formState.extra_properties.find(
      (question) => question.id === id
    )

    if (!extraProperty) return null

    if (typeof extraProperty.answer !== 'string') {
      // If the answer is an array (of selected checkboxes), map selected IDs
      const selectedAnswers =
        typeof extraProperty.answer !== 'string'
          ? // @ts-ignore
            extraProperty.answer.map((answer: any) => answer.id)
          : []

      // Generate the array as expected by react-hook-form, based on options
      return [
        'empty',
        ...Object.keys(field.meta.values).map((key: any) =>
          selectedAnswers.includes(key) ? key : false
        ),
      ]
    }

    return null
  }

  // Register the field immediately with initial value
  useEffect(() => {
    const defaultValue = getDefaultValueCheckboxInput(field.key)
    if (defaultValue && shouldRender) {
      setValue(field.key, defaultValue)
    }
  }, [field.key, setValue, shouldRender])

  if (!shouldRender) {
    return null
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
          />
          <label htmlFor={`${field.key}-${key}`}>
            {field.meta.values[key]}
          </label>
        </div>
      ))}
    </fieldset>
  )
}
