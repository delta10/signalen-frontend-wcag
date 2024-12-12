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
import { useFormStore } from '@/store/form_store'

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
  const t = useTranslations('general.form')
  const pathname = usePathname()
  const router = useRouter()
  const step = getCurrentStep(pathname)
  const { formState } = useFormStore()

  const goBack = () => {
    const previousStep = getPreviousStepPath(step)
    if (previousStep != null) {
      router.push(previousStep)
    }
  }

  const [busy, setBusy] = useState(false)
  return (
    <>
      <ButtonGroup className="!flex !flex-row !items-end">
        {step > FormStep.STEP_1_DESCRIPTION && (
          <LinkButton className="!pl-0 !mt-0" onClick={() => goBack()}>
            <Icon>
              <IconChevronLeft />
            </Icon>
            {t('back_button')}
          </LinkButton>
        )}
        {step < FormStep.STEP_4_SUMMARY && (
          <Button
            appearance="primary-action-button"
            type="submit"
            disabled={formState.isBlocking}
          >
            {t('next_button')}
            <Icon>
              <IconChevronRight />
            </Icon>
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
            <Icon>
              <IconSend />
            </Icon>
          </Button>
        )}
      </ButtonGroup>
    </>
  )
}

export { IncidentFormFooter }
