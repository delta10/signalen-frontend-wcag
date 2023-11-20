'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

import { cn } from '@/lib/utils/style'
import { TbCheck, TbCheckbox } from 'react-icons/tb'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-6 w-6 shrink-0 ring-1 ring-border transition duration-100 hover:bg-hover hover:ring-2 hover:ring-border focus:ring-2 focus:ring-focus outline-none focus-visible:outline-dashed focus-visible:outline-focus_visible data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=checked]:active:bg-active data-[state=checked]:hover:bg-hover_link data-[state=checked]:focus:bg-white data-[state=checked]:focus:text-black data-[state=checked]:focus-visible:bg-white',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <TbCheck />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
