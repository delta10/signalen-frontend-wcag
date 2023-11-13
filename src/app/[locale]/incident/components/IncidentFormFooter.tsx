import React from 'react'
import { cn } from '@/lib/utils/style'

type IncidentFormFooterProps = {} & React.HTMLAttributes<HTMLDivElement>

const IncidentFormFooter = ({
  children,
  className,
}: IncidentFormFooterProps) => {
  return (
    <div className={cn('bg-gray-200 w-full p-4', className)}>{children}</div>
  )
}

export { IncidentFormFooter }
