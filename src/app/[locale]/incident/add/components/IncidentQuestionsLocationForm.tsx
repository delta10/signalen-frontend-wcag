'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { fetchAdditionalQuestions } from '@/services/additional-questions'
import { useFormStore } from '@/store/form_store'
import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { usePathname, useRouter } from '@/routing/navigation'
import { PublicQuestion } from '@/types/form'
import { Paragraph, Alert } from '@/components/index'
import { RenderSingleField } from '@/app/[locale]/incident/add/components/questions/RenderSingleField'
import { LocationSelect } from '@/app/[locale]/incident/add/components/questions/LocationSelect'
import { useTranslations } from 'next-intl'
import { isCoordinates } from '@/lib/utils/map'
import { getCurrentStep, getNextStepPath } from '@/lib/utils/stepper'

export const IncidentQuestionsLocationForm = () => {
  const { formState: formStoreState, updateForm } = useFormStore()
  const [additionalQuestions, setAdditionalQuestions] = useState<
    PublicQuestion[]
  >([])
  const router = useRouter()
  const methods = useForm({
    resolver: (values) => {
      const errors: Record<string, any> = {}

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

      return {
        values,
        errors,
      }
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

  useEffect(() => {
    if (formStoreState.isBlocking) {
      methods.setError('submit', {
        type: 'manual',
        message: t('is_blocking'),
      })
    } else {
      methods.clearErrors('submit')
    }
  }, [formStoreState.isBlocking, methods.setError, methods.clearErrors])

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
    })

    const nextStep = getNextStepPath(step)
    if (nextStep != null) {
      router.push(nextStep)
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-start"
      >
        {methods.formState.errors.submit && (
          <Alert type="error">
            {methods.formState.errors.submit.message?.toString()}
          </Alert>
        )}
        {additionalQuestions.length ? (
          Object.keys(additionalQuestions).map((value, index, array) => {
            const question = additionalQuestions[index]
            const fieldName = question.key

            return (
              <div key={fieldName} className="w-full">
                <RenderSingleField field={question} />
              </div>
            )
          })
        ) : (
          <LocationSelect />
        )}
        <IncidentFormFooter errors={methods.formState.errors} />
      </form>
    </FormProvider>
  )
}
