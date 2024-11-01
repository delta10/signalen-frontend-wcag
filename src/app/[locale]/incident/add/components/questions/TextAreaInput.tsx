import { QuestionField } from '@/types/form'
import { useTranslations } from 'next-intl'
import { getValidators } from '@/lib/utils/form-validator'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Paragraph } from '@/components/index'

interface TextAreaInputProps extends QuestionField {}

export const TextAreaInput = ({ field }: TextAreaInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const t = useTranslations('general.errors')
  const errorMessage = errors[field.key]?.message as string

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
        id={`${field.key}`}
        aria-describedby={
          field.meta.subtitle ? `${field.key}-${field.key}` : ''
        }
      />
    </div>
  )
}
