import React from 'react'
import { cn } from '@/lib/utils/style'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

type IncidentFormFooterProps = {} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  children,
  className,
}: IncidentFormFooterProps) => {
  const t = useTranslations('general.describe_form')

  return (
    <div
      className={cn('bg-gray-200 w-full p-4 flex justify-between', className)}
    >
      <Button variant="transparent" type="submit">
        {t('back_button')}
      </Button>
      <Button variant="primary" type="submit">
        {t('next_button')}
      </Button>
    </div>
  )
}

export { IncidentFormFooter }
