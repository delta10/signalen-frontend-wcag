'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Button, ButtonGroup } from '@/components/index'
import { steps, usePathname, useRouter } from '@/routing/navigation'
import { ImSpinner8 } from 'react-icons/im'
import { FieldErrors } from 'react-hook-form'
import { getCurrentStep, getPreviousStep } from '@/lib/utils/stepper'
import { FormStep } from '@/types/form'

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
  const pathname = usePathname()
  const router = useRouter()
  const step = getCurrentStep(pathname)

  const goBack = () => {
    const previousStep = getPreviousStep(step.number)
    router.push(steps[previousStep.number])
  }

  return (
    <>
      <ButtonGroup>
        {step.number > FormStep.STEP_1_DESCRIPTION && (
          <Button
            appearance="secondary-action-button"
            type="button"
            onClick={() => goBack()}
          >
            {t('back_button')}
          </Button>
        )}
        {step.number < FormStep.STEP_4_SUMMARY && (
          <Button appearance="primary-action-button" type="submit">
            {t('next_button')}
          </Button>
        )}
        {step.number === FormStep.STEP_4_SUMMARY && (
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
