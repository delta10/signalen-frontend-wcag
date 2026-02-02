'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button, ButtonGroup, Icon, LinkButton } from '@/components'
import { usePathname, useRouter } from '@/routing/navigation'
import {
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconSend,
} from '@tabler/icons-react'
import { FieldErrors } from 'react-hook-form'
import { getCurrentStep, getPreviousStepPath } from '@/lib/utils/stepper'
import { FormStep } from '@/types/form'

type IncidentFormFooterProps = {
  handleSignalSubmit?: () => void
  loading?: boolean
  ariaDescribedById?: string
  errors?: FieldErrors
  blockNext?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  handleSignalSubmit,
  loading,
  ariaDescribedById,
  errors,
  blockNext,
}: IncidentFormFooterProps) => {
  const t = useTranslations('general.form')
  const pathname = usePathname()
  const router = useRouter()
  const step = getCurrentStep(pathname)

  const goBack = () => {
    const previousStep = getPreviousStepPath(step)
    if (previousStep != null) {
      router.push(previousStep)
    }
  }

  return (
    <>
      <ButtonGroup className="!flex !flex-row !items-end">
        {step > FormStep.STEP_1_DESCRIPTION && (
          <LinkButton className="!pl-0 !mt-0 !pr-3" onClick={() => goBack()}>
            <Icon className="!static">
              <IconChevronLeft />
            </Icon>
            {t('back_button')}
          </LinkButton>
        )}
        {step < FormStep.STEP_4_SUMMARY && (
          <Button
            purpose="primary"
            type="submit"
            className="!flex !flex-row !items-center"
            disabled={blockNext}
            iconEnd={<IconChevronRight />}
          >
            {t('next_button')}
          </Button>
        )}
        {step === FormStep.STEP_4_SUMMARY && (
          <Button
            purpose="primary"
            type="submit"
            className="!flex !flex-row !items-center"
            disabled={loading || !!errors?.submit}
            tabIndex={loading ? 0 : undefined}
            aria-describedby={ariaDescribedById}
            onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
            iconStart={
              loading ? <IconLoader2 className="animate-spin" /> : undefined
            }
            iconEnd={<IconSend />}
          >
            {t('submit_button')}
          </Button>
        )}
      </ButtonGroup>
    </>
  )
}

export { IncidentFormFooter }
