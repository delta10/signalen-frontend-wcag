'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { fetchAdditionalQuestions } from '@/services/additional-questions'
import { useFormStore } from '@/store/form_store'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useStepperStore } from '@/store/stepper_store'
import { useRouter } from '@/routing/navigation'
import { PublicQuestion } from '@/types/form'
import { RenderDynamicFields } from '@/app/[locale]/incident/add/components/questions/RenderDynamicFields'
import { Paragraph } from '../../../../../components/index'

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

  useEffect(() => {
    const appendAdditionalQuestions = async () => {
      try {
        const additionalQuestions = (await fetchAdditionalQuestions(
          formStoreState.main_category,
          formStoreState.sub_category
        )) as unknown as PublicQuestion[]

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
        ? id.filter((value: any) => value !== false && value !== 'empty')
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 items-start"
    >
      {additionalQuestions.length ? (
        <RenderDynamicFields
          data={additionalQuestions}
          register={register}
          errors={errors}
        />
      ) : loading ? (
        /* TODO: Implement nice loading state */
        <Paragraph>Laden...</Paragraph>
      ) : (
        <Paragraph>TODO: Laat hier een LocationSelect zien</Paragraph>
      )}
      <IncidentFormFooter />
    </form>
  )
}
