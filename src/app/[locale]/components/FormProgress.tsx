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
      <div className="flex flex-col w-full gap-3">
        <div className="relative flex justify-center items-center">
          {step > FormStep.STEP_1_DESCRIPTION && (
            <Button
              ico={'utrecht-icon-chevron-left'}
              appearance={'subtle-button'}
              className="absolute left-0 custom-hover pl-0-overwrite"
              onClick={() => goBack()}
            >
              <FaChevronLeft />
              Vorige
            </Button>
          )}
          <Heading level={4}>Stap {step} van 4</Heading>
          {step < FormStep.STEP_4_SUMMARY &&
            visitedSteps.includes(FormStep.STEP_3_CONTACT) && (
              <Button
                className="absolute right-0 custom-hover pr-0-overwrite"
                appearance={'subtle-button'}
                onClick={() => onNavToSummary(true)}
              >
                Naar samenvatting
                <FaChevronRight />
              </Button>
            )}
        </div>
        <div className="overflow-hidden bg-gray-200">
          {/*todo: check how to set primary color */}
          <div
            style={{ width: `${percentage}%` }}
            className="h-1  bg-green-700"
          />
        </div>
      </div>
    )
  }
  return <Button onClick={() => resetState()}>{t('new_notification')}</Button>
}

export default FormProgress
