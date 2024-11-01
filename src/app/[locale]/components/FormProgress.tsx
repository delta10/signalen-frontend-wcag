'use client'

import React, { useEffect, useState } from 'react'
import { Button, Heading } from '@utrecht/component-library-react'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { useFormStore } from '@/store/form_store'
import { steps, useRouter } from '@/routing/navigation'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { FormStep } from '@/types/form'

const FormProgress = () => {
  const t = useTranslations('stepper')
  const {
    step,
    goToStep,
    removeOneStep,
    onNavToSummary,
    visitedSteps,
    resetVisitedSteps,
  } = useStepperStore()
  const { resetForm } = useFormStore()
  const router = useRouter()

  const [percentage, setPercentage] = useState<number>(0)

  useEffect(() => {
    setPercentage((step / 4) * 100)
  }, [step])

  const resetState = () => {
    resetVisitedSteps()
    goToStep(FormStep.STEP_1_DESCRIPTION)
    resetForm()
    router.push(steps[FormStep.STEP_1_DESCRIPTION])
  }

  const navigate = () => {
    router.push(steps[step - 1])
  }

  const goBack = () => {
    removeOneStep()
    navigate()
  }

  if (!visitedSteps.includes(FormStep.STEP_4_SUMMARY)) {
    return (
      <div className="relative flex flex-col-reverse sm:flex-col">
        <div>
          {step > FormStep.STEP_1_DESCRIPTION && (
            <Button
              appearance={'subtle-button'}
              className="sm:absolute sm:left-0 sm:-top-2 custom-hover pl-0-overwrite"
              onClick={() => goBack()}
            >
              <FaChevronLeft />
              {t('back')}
            </Button>
          )}

          {step < FormStep.STEP_4_SUMMARY &&
            visitedSteps.includes(FormStep.STEP_3_CONTACT) && (
              <Button
                className="absolute right-0 sm:-top-2 custom-hover pr-0-overwrite"
                appearance={'subtle-button'}
                onClick={() => onNavToSummary(true)}
              >
                {t('to_summary')}
                <FaChevronRight />
              </Button>
            )}
        </div>

        <div className="flex flex-col justify-center sm:items-center gap-3 pb-2">
          <Heading level={4}>
            {t('step', { currentStep: step, totalSteps: 4 })}
          </Heading>
          <div className="overflow-hidden bg-gray-200 w-full">
            {/*todo: check how to set primary color */}
            <div
              style={{ width: `${percentage}%` }}
              className="h-1  bg-green-700"
            />
          </div>
        </div>
      </div>
    )
  }
  return <Button onClick={() => resetState()}>{t('new_notification')}</Button>
}

export default FormProgress
