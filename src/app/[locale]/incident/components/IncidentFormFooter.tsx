'use client'

import React from 'react'
import { cn } from '@/lib/utils/style'
import { useTranslations } from 'next-intl'
import { Button, ButtonGroup } from '@/components/index'
import { useStepperStore } from '@/store/stepper_store'
import { steps, usePathname as usePath, useRouter } from '@/routing/navigation'

type IncidentFormFooterProps = {
  handleSignalSubmit?: () => void
} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  className,
  handleSignalSubmit,
}: IncidentFormFooterProps) => {
  const t = useTranslations('general.describe_form')
  const { step, addOneStep, removeOneStep } = useStepperStore()
  const pathname = usePath()
  const router = useRouter()

  const navigate = () => {
    router.push(steps[step - 1])
  }

  const goBack = () => {
    removeOneStep()

    navigate()
  }

  return (
    <>
        <ButtonGroup>
          {step != 1 && pathname != '/incident' && (
            <Button
              appearance="undefined"
              type="button"
              className="justify-self-start self-start"
              onClick={() => goBack()}
            >
              {t('back_button')}
            </Button>
          )}
          {step < 4 && (
            <Button
              appearance="primary-action-button"
              type="submit"
              className="justify-self-end"
            >
              {t('next_button')}
            </Button>
          )}
          {step === 4 && (
            <Button
              appearance="primary-action-button"
              type="submit"
              className="justify-self-end"
              onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
            >
              {t('submit_button')}
            </Button>
          )}
        </ButtonGroup>
      </div>
    </>
  )
}

export { IncidentFormFooter }
