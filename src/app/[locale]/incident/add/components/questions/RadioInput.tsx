import React from 'react'
import { useTranslations } from 'next-intl'
import { QuestionField } from '@/types/form'
import { getValidators } from '@/lib/utils/form-validator'
import { useFormContext } from 'react-hook-form'
import { Paragraph, RadioGroup } from '@/components/index'

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
      {/* <RadioGroup
        id="7adc261b-20ea-41b8-bc5d-8bdcad6feb91"
        label="Hoe wil je dat wij contact opnemen?"
        description="We nemen alleen contact op via je favoriete optie."
        name="contact"
        status=""
        options={[
          {
            id: '4e054ee1-799e-4608-9055-19d3fc0b88e9',
            defaultValue: 'true',
            label: 'Telefoon',
            defaultChecked: true,
          },
          {
            id: '238b2692-2460-4bad-93b5-b6def8c3b820',
            defaultValue: 'true',
            label: 'E-mail',
          },
          {
            id: '6a1b86d8-f5d2-4852-9f95-b6690ac3d0e2',
            defaultValue: 'true',
            label: 'Brief',
          } as any,
        ]}
      /> */}

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
