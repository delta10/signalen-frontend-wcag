import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils/style'
import { cva, VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'rounded-md transition duration-100 font-bold outline-none border-2 focus-visible:border-focus_visible_link focus-visible:border-dashed',
  {
    variants: {
      variant: {
        primary:
          'bg-button_primary text-white active:bg-active hover:bg-button_hover focus:bg-button_focus focus:text-black',
        secondary:
          'border-2 border-button_secondary text-button_secondary bg-transparent active:border-button_active active:text-button_active active:bg-button_action hover:bg-button_action hover:border-button_hover hover:text-button_hover focus:bg-button_focus focus:text-black focus:border-button_focus',
        outline:
          'border-2 border-button_outline text-button_outline bg-transparent active:border-button_active active:text-button_active active:bg-button_action hover:bg-button_action hover:border-button_hover hover:text-button_hover focus:bg-button_focus focus:text-black focus:border-button_focus',
        transparent:
          'bg-transparent text-button_primary active:text-button_active active:bg-button_action hover:bg-button_action hover:text-button_hover focus:bg-button_focus focus:text-black focus:border-button_focus',
      },
      size: {
        md: 'px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonProps = {
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
