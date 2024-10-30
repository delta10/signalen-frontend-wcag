'use client'

import React from 'react'
import { cn } from '@/lib/utils/style'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { useStepperStore } from '@/store/stepper_store'
import { steps, usePathname as usePath, useRouter } from '@/routing/navigation'
import { ImSpinner8 } from 'react-icons/im'

type IncidentFormFooterProps = {
  handleSignalSubmit?: () => void
  loading?: boolean
  ariaDescribedById?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  className,
  handleSignalSubmit,
  loading,
  ariaDescribedById,
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
          // Note: current button has no visual indicator when disabled.
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            aria-describedby={ariaDescribedById}
            className="flex items-center gap-2 justify-self-end"
            onClick={() => (handleSignalSubmit ? handleSignalSubmit() : null)}
          >
            {loading && <ImSpinner8 className="animate-spin" />}
            {t('submit_button')}
          </Button>
        )}
      </div>
    </>
  )
}

export { IncidentFormFooter }
