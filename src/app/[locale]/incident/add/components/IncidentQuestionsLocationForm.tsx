'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { fetchAdditionalQuestions } from '@/services/additional-questions'
import { useFormStore } from '@/store/form_store'
import {
  FieldTypeEnum,
  PublicQuestionSerializerDetail,
} from '@/services/client'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'

export const IncidentQuestionsLocationForm = () => {
  const { formState: formStoreState } = useFormStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [additionalQuestions, setAdditionalQuestions] = useState<
    PublicQuestionSerializerDetail[]
  >([])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // TODO: remove hardcoded marker
  const marker = [0, 0]

  const additionalQuestionTypes = {
    [FieldTypeEnum.RADIO_INPUT]: (field: PublicQuestionSerializerDetail) => (
      <RadioGroup register={register} field={field} errors={errors} />
    ),
    [FieldTypeEnum.PLAIN_TEXT]: (props: any) => <div>{props.value}</div>,
    [FieldTypeEnum.TEXT_INPUT]: (props: any) => <div>TextInput</div>,
    [FieldTypeEnum.MULTI_TEXT_INPUT]: (props: any) => <div>MultiTextInput</div>,
    [FieldTypeEnum.CHECKBOX_INPUT]: (props: any) => <div>CheckboxInput</div>,
    [FieldTypeEnum.SELECT_INPUT]: (props: any) => <div>SelectInput</div>,
    [FieldTypeEnum.TEXT_AREA_INPUT]: (props: any) => <div>TextAreaInput</div>,
    [FieldTypeEnum.ASSET_SELECT]: null,
    [FieldTypeEnum.LOCATION_SELECT]: (props: any) => (
      <LocationSelect marker={marker} {...props} />
    ),
  }

  useEffect(() => {
    const appendAdditionalQuestions = async () => {
      try {
        const additionalQuestions = await fetchAdditionalQuestions(
          formStoreState.main_category,
          formStoreState.sub_category
        )

        additionalQuestions.filter(
          (question) => additionalQuestionTypes[question.field_type]
        )

        setAdditionalQuestions(additionalQuestions)
        setLoading(false)
      } catch (e) {
        console.error('Could not fetch additional questions', e)
        setLoading(false)
      }
    }

    appendAdditionalQuestions()
  }, [formStoreState.main_category, formStoreState.sub_category])

  const onSubmit = (data: any) => {
    // TODO: Add question answers to save call
    console.log('Submitted Data:', data)
  }

  const renderFields = (data: PublicQuestionSerializerDetail[]) => {
    return Object.keys(data).map((value, index, array) => {
      const question = data[index]

      const fieldName = question.key

      return (
        <div key={fieldName} className="w-full">
          {additionalQuestionTypes[question.field_type]?.(question)}
        </div>
      )
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 items-start"
    >
      {additionalQuestions.length ? (
        renderFields(additionalQuestions)
      ) : loading ? (
        /* TODO: Implement nice loading state */
        <p>Laden...</p>
      ) : (
        <p>TODO: Laat hier een LocationSelect zien</p>
      )}
      <IncidentFormFooter />
    </form>
  )
}
