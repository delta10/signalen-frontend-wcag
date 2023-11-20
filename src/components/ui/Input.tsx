import React from 'react'
import { cn } from '@/lib/utils/style'

type InputProps = {
  value: string | number | readonly string[] | undefined | null
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        {...props}
        ref={ref}
        className={cn(
          'p-3 transition duration-100 ring-1 ring-border hover:ring-2 hover:bg-hover focus:ring-2 focus:ring-focus outline-none focus-visible:outline-dashed focus-visible:outline-focus_visible',
          className
        )}
      />
    )
  }
)

Input.displayName = 'Input'
