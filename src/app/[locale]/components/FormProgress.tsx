'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@utrecht/component-library-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/routing/navigation'
import { FaChevronLeft } from 'react-icons/fa'
import { FormStep } from '@/types/form'
import { getCurrentStep, getPreviousStepPath } from '@/lib/utils/stepper'

interface FormProgressProps {
  children?: React.ReactElement
}

const FormProgress = ({ children }: FormProgressProps) => {
  const t = useTranslations('stepper')
  const router = useRouter()
  const pathname = usePathname()
  const step = getCurrentStep(pathname)

  const [percentage, setPercentage] = useState<number>(1)

  useEffect(() => {
    setPercentage((step / 4) * 100)
  }, [step])

  const back = () => {
    const previousStep = getPreviousStepPath(step)
    if (previousStep != null) {
      router.push(previousStep)
    }
  }

  if (step < FormStep.STEP_5_THANK_YOU) {
    return (
      <div className="flex flex-col">
        {step > FormStep.STEP_1_DESCRIPTION && (
          <Button
            appearance={'subtle-button'}
            className="stepper-button-hover pl-0-overwrite"
            onClick={() => back()}
          >
            <FaChevronLeft />
            {t('back')}
          </Button>
        )}

        <div className="flex flex-col gap-3 pb-2">
          {children}
          <div className="overflow-hidden w-full background-gray-200">
            <div
              style={{
                width: `${percentage}%`,
              }}
              className="h-3 background-primary"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default FormProgress
