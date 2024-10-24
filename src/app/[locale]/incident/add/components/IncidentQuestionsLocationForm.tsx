'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { fetchAdditionalQuestions } from '@/services/additional-questions'
import { useFormStore } from '@/store/form_store'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import { RadioInput } from '@/app/[locale]/incident/add/components/questions/RadioInput'
import { TextInput } from '@/app/[locale]/incident/add/components/questions/TextInput'
import { PlainText } from '@/app/[locale]/incident/add/components/questions/PlainText'
import { CheckboxInput } from '@/app/[locale]/incident/add/components/questions/CheckboxInput'
import { TextAreaInput } from '@/app/[locale]/incident/add/components/questions/TextAreaInput'
import { AssetSelect } from '@/app/[locale]/incident/add/components/questions/AssetSelect'
import { FieldTypes, PublicQuestion } from '@/types/form'

export const IncidentQuestionsLocationForm = () => {
  const { formState: formStoreState, updateForm } = useFormStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [additionalQuestions, setAdditionalQuestions] = useState<
    PublicQuestion[]
  >([])
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    router.prefetch('/incident/contact')
  }, [router])

  // TODO: remove hardcoded marker
  const marker = [0, 0]

  const additionalQuestionTypes = {
    [FieldTypes.RADIO_INPUT]: (field: PublicQuestion) => (
      <RadioInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.PLAIN_TEXT]: (field: PublicQuestion) => (
      <PlainText field={field} />
    ),
    [FieldTypes.TEXT_INPUT]: (field: PublicQuestion) => (
      <TextInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.CHECKBOX_INPUT]: (field: PublicQuestion) => (
      <CheckboxInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.TEXT_AREA_INPUT]: (field: PublicQuestion) => (
      <TextAreaInput register={register} field={field} errors={errors} />
    ),
    [FieldTypes.ASSET_SELECT]: (field: PublicQuestion) => (
      <AssetSelect field={field} />
    ),
    [FieldTypes.LOCATION_SELECT]: (props: any) => (
      <LocationSelect marker={marker} {...props} />
    ),
  }

  useEffect(() => {
    const appendAdditionalQuestions = async () => {
      try {
        const additionalQuestions = (await fetchAdditionalQuestions(
          formStoreState.main_category,
          formStoreState.sub_category
        )) as unknown as PublicQuestion[]

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
    const questionKeys = Object.keys(data)
    const questionsToSubmit = additionalQuestions.filter(
      (question) =>
        questionKeys.includes(question.key) &&
        data[question.key] !== null &&
        data[question.key] !== ''
    )

    const answers = questionsToSubmit.map((question) => {
      const id = data[question.key]
      const checkboxAnswers: string[] = Array.isArray(id)
        ? id.filter((key: any) => key !== false && key !== 'empty')
        : []

      // If checkboxAnswers has a length, map over them to return a list of answer objects
      const answer =
        checkboxAnswers.length > 0
          ? checkboxAnswers.map((answerId) => ({
              id: answerId,
              label: question.meta.values[answerId],
              info: '',
            }))
          : question.meta?.values?.[id]
            ? {
                id: id,
                label: question.meta.values[id],
                info: '',
              }
            : data[question.key]

      return {
        id: question.key,
        label: question.meta.label,
        category_url: `/signals/v1/public/terms/categories/${formStoreState.sub_category}/sub_categories/${formStoreState.main_category}`,
        answer,
      }
    })

    updateForm({
      ...formStoreState,
      extra_properties: answers,
    })

    setLastCompletedStep(2)
    addOneStep()

    router.push('/incident/contact')
  }

  const renderFields = (data: PublicQuestion[]) => {
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
