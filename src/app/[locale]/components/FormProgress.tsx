'use client'

import React, { useEffect, useState } from 'react'
import { Button, Heading } from '@utrecht/component-library-react'
import { useTranslations } from 'next-intl'
import { useFormStore } from '@/store/form_store'
import { stepToPath, usePathname, useRouter } from '@/routing/navigation'
import { FaChevronLeft } from 'react-icons/fa'
import { FormStep } from '@/types/form'
import { getCurrentStep, getPreviousStepPath } from '@/lib/utils/stepper'

const FormProgress = () => {
  const t = useTranslations('stepper')
  const { resetForm } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)

  const [percentage, setPercentage] = useState<number>(1)

  useEffect(() => {
    setPercentage((step / 4) * 100)
  }, [step])

  const resetState = () => {
    resetForm()
    router.push(stepToPath[FormStep.STEP_1_DESCRIPTION])
  }

  const back = () => {
    const previousStep = getPreviousStepPath(step)
    if (previousStep != null) {
      router.push(previousStep)
    }
  }

  if (step < FormStep.STEP_5_THANK_YOU) {
    return (
      <div className="relative flex flex-col-reverse sm:flex-col">
        <div>
          {step > FormStep.STEP_1_DESCRIPTION && (
            <Button
              appearance={'subtle-button'}
              className="sm:absolute sm:left-0 sm:-top-2 stepper-button-hover pl-0-overwrite"
              onClick={() => back()}
            >
              <FaChevronLeft />
              {t('back')}
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