'use client'

import React from 'react'
import { cn } from '@/lib/utils/style'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { useStepperStore } from '@/store/store'
import { steps, usePathname as usePath, useRouter } from '@/routing/navigation'

type IncidentFormFooterProps = {} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({ className }: IncidentFormFooterProps) => {
  const t = useTranslations('general.describe_form')
  const { step, addOneStep, removeOneStep } = useStepperStore()
  const pathname = usePath()
  const router = useRouter()

  const navigate = () => {
    router.push(steps[step - 1])

    console.log('test')
  }

  const goBack = () => {
    removeOneStep()

    navigate()
  }

  return (
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
          type="submit"
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
    </div>
  )
}

export { IncidentFormFooter }
