import { FieldTypes, PublicQuestion } from '@/types/form'
import { useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useFormStore } from '@/store/form_store'
import { RadioInput } from '@/app/[locale]/incident/add/components/questions/RadioInput'
import { PlainText } from '@/app/[locale]/incident/add/components/questions/PlainText'
import { TextInput } from '@/app/[locale]/incident/add/components/questions/TextInput'
import { CheckboxInput } from '@/app/[locale]/incident/add/components/questions/CheckboxInput'
import { TextAreaInput } from '@/app/[locale]/incident/add/components/questions/TextAreaInput'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { evaluateConditions } from '@/lib/utils/check-visibility'
import { AssetSelect } from '@/app/[locale]/incident/add/components/questions/AssetSelect'

export const RenderSingleField = ({ field }: { field: PublicQuestion }) => {
  const [shouldRender, setShouldRender] = useState<boolean>(false)
  const { watch, setValue } = useFormContext()
  const { formState: formStoreState, updateForm } = useFormStore()

  const watchValues = watch()

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
        const defaultValue =
          field.field_type === FieldTypes.CHECKBOX_INPUT
            ? getDefaultValueCheckboxInput(field.key)
            : field.field_type === FieldTypes.RADIO_INPUT
              ? getDefaultValueRadioInput(field.key)
              : getDefaultValueTextInput(field.key)
        if (defaultValue) {
          setValue(field.key, defaultValue)
        }
      }
    }
  }, [shouldRenderResult, shouldRender, field.key, setValue])

  // Get default value textbox helper function
  const getDefaultValueTextInput = (id: string) => {
    const extraProperties = formStoreState.extra_properties.filter(
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

  // Get default value checkbox helper function
  const getDefaultValueCheckboxInput = (id: string) => {
    const extraProperty = formStoreState.extra_properties.find(
      (question) => question.id === id
    )

    if (!extraProperty) return null

    if (typeof extraProperty.answer !== 'string') {
      // If the answer is an array (of selected checkboxes), map selected IDs
      const selectedAnswers =
        // @ts-ignore
        typeof extraProperty.answer !== 'string' && extraProperty.answer.length
          ? // @ts-ignore
            extraProperty.answer?.map((answer: any) => answer?.id)
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

  // Get default value radio input helper function
  const getDefaultValueRadioInput = (id: string) => {
    const extraProperty = formStoreState.extra_properties.find(
      (question) => question.id === id
    )

    if (!extraProperty) return null

    if (typeof extraProperty.answer !== 'string' && extraProperty.answer?.id) {
      return extraProperty.answer.id
    }

    return null
  }

  // Register the field immediately with initial value
  useEffect(() => {
    const defaultValue =
      field.field_type === FieldTypes.CHECKBOX_INPUT
        ? getDefaultValueCheckboxInput(field.key)
        : field.field_type === FieldTypes.RADIO_INPUT
          ? getDefaultValueRadioInput(field.key)
          : getDefaultValueTextInput(field.key)
    if (defaultValue && shouldRender) {
      setValue(field.key, defaultValue)
    }
  }, [field.key, setValue, shouldRender])

  // control hard stop
  useEffect(() => {
    if (field.meta.validators) {
      const isBlocking =
        field.meta.validators === 'isBlocking'
          ? true
          : !!field.meta.validators.includes('isBlocking')

      updateForm({
        ...formStoreState,
        isBlocking: shouldRender ? isBlocking : false,
      })
    }
  }, [field, shouldRender])

  if (!shouldRender) {
    return null
  }

  return additionalQuestionTypes[field.field_type]?.(field)
}
