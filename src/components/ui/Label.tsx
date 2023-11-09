import * as LabelPrimitive from '@radix-ui/react-label'
import React from 'react'
import { cn } from '@/lib/utils/style'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn('', className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
