'use client'

import React, { useEffect, useState } from 'react'
import { Button, ButtonLink, Heading4 } from '@utrecht/component-library-react'
import { useTranslations } from 'next-intl'
import { useStepperStore } from '@/store/stepper_store'
import { useFormStore } from '@/store/form_store'
import { Link } from '@utrecht/component-library-react/dist/css-module'
import { steps, usePathname, useRouter } from '@/routing/navigation'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
type Props = {}

const FormProgress = ({}: Props) => {
  const t = useTranslations('stepper')
  const {
    step,
    lastCompletedStep,
    goToStep,
    setLastCompletedStep,
    removeOneStep,
  } = useStepperStore()
  const { resetForm } = useFormStore()
  const router = useRouter()
  const pathname = usePathname()

  const [percentage, setPercentage] = useState<number>(0)

  useEffect(() => {
    setPercentage((step / 4) * 100)
  }, [step])

  const resetState = () => {
    setLastCompletedStep(0)
    goToStep(1)
    resetForm()
  }

  const navigate = () => {
    router.push(steps[step - 1])
  }

  const goBack = () => {
    removeOneStep()

    navigate()
  }

  if (pathname !== '/incident/thankyou') {
    return (
      <div className="flex flex-col w-full gap-3">
        <div className="relative flex justify-center items-center">
          {step !== 1 && (
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
          <Heading4>Stap {step} van 4</Heading4>
          {lastCompletedStep && (
            <ButtonLink
              className="absolute right-0 custom-hover pr-0-overwrite"
              appearance={'subtle-button'}
              onClick={() => goToStep(4)}
              href="/incident/summary"
            >
              Naar samenvatting
              <FaChevronRight />
            </ButtonLink>
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
  return (
    <Button onClick={() => resetState()} asChild>
      <Link href={'/incident'}>{t('new_notification')}</Link>
    </Button>
  )
}

export default FormProgress
