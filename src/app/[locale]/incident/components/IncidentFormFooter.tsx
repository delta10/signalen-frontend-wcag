'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, ButtonGroup } from '@/components/index'
import { usePathname, useRouter } from '@/routing/navigation'
import { IconLoader2 } from '@tabler/icons-react'
import { FieldErrors } from 'react-hook-form'
import { getCurrentStep, getPreviousStepPath } from '@/lib/utils/stepper'
import { FormStep } from '@/types/form'
import { AlertText } from '@/components/ui/LiveText'

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
    const previousStep = getPreviousStepPath(step)
    if (previousStep != null) {
      router.push(previousStep)
    }
  }

  const [busy, setBusy] = useState(false)
  return (
    <>
      <ButtonGroup>
        {step > FormStep.STEP_1_DESCRIPTION && (
          <Button
            appearance="secondary-action-button"
            type="button"
            onClick={() => goBack()}
          >
            {t('back_button')}
          </Button>
        )}
        {step < FormStep.STEP_4_SUMMARY && (
          <Button appearance="primary-action-button" type="submit">
            {t('next_button')}
          </Button>
        )}
        {step === FormStep.STEP_4_SUMMARY && (
          <Button
            appearance="primary-action-button"
            type="submit"
            disabled={loading || !!errors?.submit}
            tabIndex={loading ? 0 : undefined}
            aria-describedby={ariaDescribedById}
            onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
          >
            {loading && <IconLoader2 className="animate-spin" />}
            {t('submit_button')}
          </Button>
        )}
      </ButtonGroup>
    </>
  )
}

export { IncidentFormFooter }
