import { cn } from '@/lib/utils/style'
import React from 'react'

type TextareaProps = {} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'p-3 w-full transition duration-100 ring-1 ring-border hover:ring-2 hover:bg-hover focus:ring-2 focus:ring-focus outline-none focus-visible:outline-dashed focus-visible:outline-focus_visible',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
