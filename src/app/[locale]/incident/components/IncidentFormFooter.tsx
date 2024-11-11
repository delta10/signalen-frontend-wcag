'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button, ButtonGroup } from '@/components/index'
import { useStepperStore } from '@/store/stepper_store'
import { steps, usePathname as usePath, useRouter } from '@/routing/navigation'
import { ImSpinner8 } from 'react-icons/im'
import { FieldErrors } from 'react-hook-form'

type IncidentFormFooterProps = {
  handleSignalSubmit?: () => void
  loading?: boolean
  ariaDescribedById?: string
  errors?: FieldErrors
} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  handleSignalSubmit,
  loading,
  ariaDescribedById,
  errors,
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
            appearance="secondary-action-button"
            type="button"
            onClick={() => goBack()}
          >
            {t('back_button')}
          </Button>
        )}
        {step < 4 && (
          <Button appearance="primary-action-button" type="submit">
            {t('next_button')}
          </Button>
        )}
        {step === 4 && (
          <Button
            appearance="primary-action-button"
            type="submit"
            disabled={loading || !!errors?.submit}
            tabIndex={loading ? 0 : undefined}
            aria-describedby={ariaDescribedById}
            onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
          >
            {loading && <ImSpinner8 className="animate-spin" />}
            {t('submit_button')}
          </Button>
        )}
      </ButtonGroup>
    </>
  )
}

export { IncidentFormFooter }
