import React from 'react'
import { cn } from '@/lib/utils/style'

type InputProps = {} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        {...props}
        ref={ref}
        className={cn('flex', className)}
      />
    )
  }
)

Input.displayName = 'Input'
