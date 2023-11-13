import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/style'

type ButtonProps = {
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return <Comp className={cn('', className)} ref={ref} {...props} />
  }
)

Button.displayName = 'Button'

export { Button }
