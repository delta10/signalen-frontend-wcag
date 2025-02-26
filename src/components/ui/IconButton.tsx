import React, {
  PropsWithChildren,
  forwardRef,
  ForwardedRef,
  useId,
  ReactNode,
} from 'react'
import { Button, ButtonProps, Icon } from '@/components/index'
import { cn } from '@/lib/utils/style'

export interface IconButtonProps extends ButtonProps {
  label: ReactNode
  mobileView?: boolean
}

export const IconButton = forwardRef(
  (
    {
      label,
      id,
      children,
      type,
      className,
      mobileView = false,
      ...restProps
    }: PropsWithChildren<IconButtonProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const labelId = id ? `${id}-label` : useId()

    return (
      <Button
        aria-labelledby={labelId}
        className={cn(className, { mobile: mobileView })}
        ref={ref}
        {...restProps}
      >
        <span id={labelId} hidden>
          {label}
        </span>
        <Icon>{children}</Icon>
      </Button>
    )
  }
)

IconButton.displayName = 'IconButton'
