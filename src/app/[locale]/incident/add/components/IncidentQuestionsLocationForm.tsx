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

export const IncidentQuestionsLocationForm = () => {
  const { formState: formStoreState, updateForm } = useFormStore()
  const [loading, setLoading] = useState<boolean>(true)
  const [additionalQuestions, setAdditionalQuestions] = useState<
    PublicQuestion[]
  >([])
  const [conditionalQuestions, setConditionalQuestions] = useState<
    PublicQuestion[]
  >([])
  const { addOneStep, setLastCompletedStep } = useStepperStore()
  const router = useRouter()
  const {
    register,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    router.prefetch('/incident/contact')
  }, [router])

  useEffect(() => {
    const appendAdditionalQuestions = async () => {
      try {
        if (
          formStoreState.main_category !== 'overig' &&
          formStoreState.sub_category !== 'overig'
        ) {
          const additionalQuestions = (await fetchAdditionalQuestions(
            formStoreState.main_category,
            formStoreState.sub_category
          )) as unknown as PublicQuestion[]

          // Don't embed question in default additionalQuestions list if ifOneOf or ifAllOf is set on the meta of the question
          const defaultAdditionalQuestions = additionalQuestions.filter(
            (question) => !question.meta.ifOneOf && !question.meta.ifAllOf
          )

          // Embed question in conditionalQuestions list if ifOneOf or ifAllOf is set on the meta of the question
          const conditionalQuestions = additionalQuestions.filter(
            (question) => question.meta.ifOneOf || question.meta.ifAllOf
          )

          setAdditionalQuestions(defaultAdditionalQuestions)
          setConditionalQuestions(conditionalQuestions)
        }

        setLoading(false)
      } catch (e) {
        console.error('Could not fetch additional questions', e)
        setLoading(false)
      }
    }

    appendAdditionalQuestions()
  }, [formStoreState.main_category, formStoreState.sub_category])

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const changedFieldName = name?.split('.')[0]

      if (changedFieldName) {
        // TODO: build support for nesting and ifAllOf, order of fields, checkboxes, remove fields that are dependent on a field that was removed, store hard stop that is conditional and filled in in formState
        const conditionalQuestionsThatDependOnChangedField =
          conditionalQuestions.filter(
            (question) => question.meta.ifOneOf[changedFieldName]
          )

        conditionalQuestionsThatDependOnChangedField.map((question) => {
          const matchValue: string[] = question.meta.ifOneOf[changedFieldName]
          const inputValue = getValues(changedFieldName)
          const conditionalFieldName = question.key
          const newAdditionalQuestions = Array.from(additionalQuestions)

          const matchesValue = Array.isArray(inputValue)
            ? inputValue.some((value) => matchValue.includes(value))
            : matchValue.includes(inputValue)

          if (matchesValue) {
            if (
              newAdditionalQuestions.findIndex(
                (questionToTest) => questionToTest.key === question.key
              ) === -1
            ) {
              newAdditionalQuestions.push(question)

              setAdditionalQuestions(newAdditionalQuestions)
            }
          } else {
            const filteredNewAdditionalQuestions =
              newAdditionalQuestions.filter(
                (question) => question.key !== conditionalFieldName
              )

            setAdditionalQuestions(filteredNewAdditionalQuestions)
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, conditionalQuestions, additionalQuestions])

  // If any conditional questions have already been filled in, display them by default.
  useEffect(() => {
    const storedConditionalQuestions = conditionalQuestions.filter(
      (question) =>
        formStoreState.extra_properties.findIndex(
          (storedQuestion) => storedQuestion.id === question.key
        ) !== -1
    )

    if (storedConditionalQuestions.length) {
      const newAdditionalQuestions = Array.from(additionalQuestions)
      newAdditionalQuestions.push(...storedConditionalQuestions)

      setAdditionalQuestions(newAdditionalQuestions)
    }
  }, [conditionalQuestions])

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
        <p>Laden...</p>
      ) : (
        <p>TODO: Laat hier een LocationSelect zien</p>
      )}
      <IncidentFormFooter />
    </form>
  )
}
