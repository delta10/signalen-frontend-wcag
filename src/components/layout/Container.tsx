import React from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const containerVariants = cva('mx-auto px-4 xl:px-0', {
  variants: {
    size: {
      xs: 'max-w-xl',
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants>

const Container = ({ size, children, className, ...props }: ContainerProps) => {
  return (
    <div className={containerVariants({ size, className })} {...props}>
      {children}
    </div>
  )
}

export { Container }
