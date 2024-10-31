'use client'

import React from 'react'
import { cn } from '@/lib/utils/style'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { useStepperStore } from '@/store/stepper_store'
import { steps, usePathname as usePath, useRouter } from '@/routing/navigation'
import { useFormContext } from 'react-hook-form'

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
  const {
    formState: { errors },
  } = useFormContext()

  const navigate = () => {
    router.push(steps[step - 1])
  }

  const goBack = () => {
    removeOneStep()

    navigate()
  }

  return (
    <>
      <div
        className={cn(
          `bg-gray-200 w-full p-4 flex justify-end ${
            step != 1 && pathname != '/incident' ? 'justify-between' : ''
          }`,
          className
        )}
      >
        {step != 1 && pathname != '/incident' && (
          <Button
            variant="transparent"
            type="button"
            className="justify-self-start self-start"
            onClick={() => goBack()}
          >
            {t('back_button')}
          </Button>
        )}
        {step < 4 && (
          <Button variant="primary" type="submit" className="justify-self-end">
            {t('next_button')}
          </Button>
        )}
        {step === 4 && (
          <Button
            variant="primary"
            type="submit"
            className="justify-self-end"
            disabled={!!errors.submit}
            onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
          >
            {t('submit_button')}
          </Button>
        )}
      </div>
    </>
  )
}

export { IncidentFormFooter }
