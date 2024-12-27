'use client'

import React, { useEffect, useState } from 'react'
import { LinkButton, Icon } from '@/components/index'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/routing/navigation'
import { FormStep } from '@/types/form'
import { getCurrentStep, getPreviousStepPath } from '@/lib/utils/stepper'
import { IconChevronLeft } from '@tabler/icons-react'
import { ProgressBar } from './ProgressBar'

interface FormProgressProps {
  children?: React.ReactElement
}

const FormProgress = ({ children }: FormProgressProps) => {
  const t = useTranslations('general.form')
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
      <div className="flex flex-col gap-1">
        {step > FormStep.STEP_1_DESCRIPTION && (
          <div>
            <LinkButton className="!pl-0" onClick={() => back()}>
              <Icon>
                <IconChevronLeft />
              </Icon>
              {t('back_button')}
            </LinkButton>
          </div>
        )}

        <div className="flex flex-col gap-3 pb-2">
          {children}
          <ProgressBar value={step / 4} />
        </div>
      </div>
    )
  }
}

export default FormProgress
