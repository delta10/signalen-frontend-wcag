import React, {
  ButtonHTMLAttributes,
  PropsWithChildren,
  forwardRef,
  ForwardedRef,
  useId,
  ReactNode,
} from 'react'
import { Button, Icon } from '@/components/index'
import clsx from 'clsx'

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: ReactNode
}

export const IconButton = forwardRef(
  (
    {
      label,
      id,
      children,
      className,
      ...restProps
    }: PropsWithChildren<IconButtonProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const labelId = id ? `${id}-label` : useId()

    return (
      <Button
        aria-labelledby={labelId}
        className={clsx('signalen-icon-button', className)}
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
