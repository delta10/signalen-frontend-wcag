'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { fetchAdditionalQuestions } from '@/services/additional-questions'
import { useFormStore } from '@/store/form_store'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { usePathname, useRouter } from '@/routing/navigation'
import { PublicQuestion } from '@/types/form'
import { RenderSingleField } from '@/app/[locale]/incident/add/components/questions/RenderSingleField'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { useTranslations } from 'next-intl'
import { isCoordinates } from '@/lib/utils/map'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'

export const IncidentQuestionsLocationForm = () => {
  const { formState: formStoreState, updateForm } = useFormStore()
  const [isBlocking, setIsBlocking] = useState(false)
  const [additionalQuestions, setAdditionalQuestions] = useState<
    PublicQuestion[]
  >([])
  const router = useRouter()
  const methods = useForm({
    resolver: (values) => {
      const errors: Record<string, any> = {}

      // Required fields validation
      Object.keys(values).forEach((key) => {
        const question = additionalQuestions.find(
          (question) => question.key === key
        )

        if (!values[key] && question?.required) {
          errors[key] = {
            type: 'required',
            message: t('required'),
          }
        }
      })

      // Location validation
      if (
        !isCoordinates(formStoreState.coordinates) ||
        (formStoreState.coordinates[0] === 0 &&
          formStoreState.coordinates[1] === 0)
      ) {
        errors.location = {
          type: 'manual',
          message: t('location_required'),
        }
      }

      return Object.keys(errors).length > 0
        ? { values: {}, errors }
        : { values, errors: {} }
    },
  })
  const t = useTranslations('general.errors')
  const pathname = usePathname()
  const step = getCurrentStep(pathname)

  useEffect(() => {
    router.prefetch('/incident/contact')
  }, [router])

  useEffect(() => {
    const appendAdditionalQuestions = async () => {
      try {
        const additionalQuestions = await fetchAdditionalQuestions(
          formStoreState.main_category,
          formStoreState.sub_category
        )

        setAdditionalQuestions(additionalQuestions)
      } catch (e) {
        console.error('Could not fetch additional questions', e)
      }
    }

    appendAdditionalQuestions()
  }, [formStoreState.main_category, formStoreState.sub_category])

  useEffect(() => {
    // Only trigger if there's already a location error (meaning form was submitted)
    if (methods.formState.errors.location) {
      methods.trigger()
    }
  }, [formStoreState.coordinates, methods])

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

      const isFeature = checkboxAnswers.some(
        (answer: any) => answer.type === 'Feature'
      )

      // If checkboxAnswers has a length, map over them to return a list of answer objects. If isFeature return list of already made answers
      const answer = isFeature
        ? checkboxAnswers
        : checkboxAnswers.length > 0
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
        label: question.meta.shortLabel
          ? question.meta.shortLabel
          : question.meta.label,
        category_url: `/signals/v1/public/terms/categories/${formStoreState.sub_category}/sub_categories/${formStoreState.main_category}`,
        answer,
      }
    })

    updateForm({
      ...formStoreState,
      extra_properties: answers,
      last_completed_step: Math.max(formStoreState.last_completed_step, step),
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  const handleError = (errors: Record<string, any>) => {
    // Get the first field with an error
    const firstErrorKey = Object.keys(errors)[0]
    if (firstErrorKey) {
      methods.setFocus(firstErrorKey) // Focus the field with the first error
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, handleError)}
        className="flex flex-col gap-8 items-start"
      >
        {additionalQuestions.length ? (
          Object.keys(additionalQuestions).map((value, index, array) => {
            const question = additionalQuestions[index]
            const fieldName = question.key

            return (
              <RenderSingleField
                key={fieldName}
                field={question}
                setIsBlocking={setIsBlocking}
              />
            )
          })
        ) : (
          <LocationSelect />
        )}
        <IncidentFormFooter
          errors={methods.formState.errors}
          blockNext={isBlocking}
        />
      </form>
    </FormProvider>
  )
}
