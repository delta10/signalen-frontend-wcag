import { FieldTypes, PublicQuestion } from '@/types/form'
import { useEffect, useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { useFormStore } from '@/store/form_store'
import type { FormStoreState } from '@/types/stores'
import { RadioInput } from '@/app/[locale]/incident/add/components/questions/RadioInput'
import { PlainText } from '@/app/[locale]/incident/add/components/questions/PlainText'
import { TextInput } from '@/app/[locale]/incident/add/components/questions/TextInput'
import { CheckboxInput } from '@/app/[locale]/incident/add/components/questions/CheckboxInput'
import { TextAreaInput } from '@/app/[locale]/incident/add/components/questions/TextAreaInput'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { AssetSelect } from '@/app/[locale]/incident/add/components/questions/AssetSelect'

type props = {
  field: PublicQuestion
  setIsBlocking: (isBlocking: boolean) => void
}

export const RenderSingleField = ({ field, setIsBlocking }: props) => {
  const { control, setValue, unregister } = useFormContext()
  const extraProperties = useFormStore(
    (state) => state.formState.extra_properties
  )
  const watchValues = useWatch({ control })
  const shouldRender = evaluateConditions(field.meta, watchValues)
  const defaultValue = useMemo(
    () =>
      getDefaultValue(
        field.key,
        field.field_type,
        field.meta.values,
        extraProperties
      ),
    [field.key, field.field_type, field.meta.values, extraProperties]
  )

  const additionalQuestionTypes = {
    [FieldTypes.RADIO_INPUT]: (field: PublicQuestion) => (
      <RadioInput field={field} />
    ),
    [FieldTypes.PLAIN_TEXT]: (field: PublicQuestion) => (
      <PlainText field={field} />
    ),
    [FieldTypes.TEXT_INPUT]: (field: PublicQuestion) => (
      <TextInput field={field} />
    ),
    [FieldTypes.CHECKBOX_INPUT]: (field: PublicQuestion) => (
      <CheckboxInput field={field} />
    ),
    [FieldTypes.TEXT_AREA_INPUT]: (field: PublicQuestion) => (
      <TextAreaInput field={field} />
    ),
    [FieldTypes.ASSET_SELECT]: (field: PublicQuestion) => (
      <AssetSelect field={field} />
    ),
    [FieldTypes.LOCATION_SELECT]: (field: PublicQuestion) => (
      <LocationSelect field={field} />
    ),
  }

  useEffect(() => {
    if (!shouldRender) {
      setValue(field.key, null)
      unregister(field.key)
      return
    }

    if (defaultValue) {
      setValue(field.key, defaultValue)
    }
  }, [field.key, defaultValue, setValue, shouldRender, unregister])

  // control hard stop
  useEffect(() => {
    if (field.meta.validators) {
      const isBlocking = !!(
        field.meta.validators === 'isBlocking' ||
        (typeof field.meta.validators === 'object' &&
          field.meta.validators.includes('isBlocking'))
      )

      setIsBlocking(shouldRender ? isBlocking : false)
    }
  }, [field, shouldRender, setIsBlocking])

  if (!shouldRender) {
    return null
  }

  return additionalQuestionTypes[field.field_type]?.(field)
}

function getDefaultValue(
  key: PublicQuestion['key'],
  fieldType: PublicQuestion['field_type'],
  values: PublicQuestion['meta']['values'],
  extraProperties: FormStoreState['extra_properties']
) {
  const extraProperty = extraProperties.find((question) => question.id === key)

  if (fieldType === FieldTypes.CHECKBOX_INPUT) {
    if (!extraProperty || typeof extraProperty.answer === 'string') return null

    const selectedAnswers = Array.isArray(extraProperty.answer)
      ? extraProperty.answer.map((answer) => answer?.id)
      : []

    return [
      'empty',
      ...Object.keys(values).map((key) =>
        selectedAnswers.includes(key) ? key : false
      ),
    ]
  }

  if (fieldType === FieldTypes.RADIO_INPUT) {
    return extraProperty && typeof extraProperty.answer !== 'string'
      ? extraProperty.answer?.id || null
      : null
  }

  return typeof extraProperty?.answer === 'string' ? extraProperty.answer : ''
}
