import React, {
  PropsWithChildren,
  forwardRef,
  ForwardedRef,
  useId,
  ReactNode,
} from 'react'
import { Button, ButtonProps, Icon } from '@/components/index'
import clsx from 'clsx'
import { useMediaQuery } from '@uidotdev/usehooks'

export interface IconButtonProps extends ButtonProps {
  label: ReactNode
}

export const IconButton = forwardRef(
  (
    {
      label,
      id,
      children,
      type,
      className,
      ...restProps
    }: PropsWithChildren<IconButtonProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const labelId = id ? `${id}-label` : useId()
    const isMobile = useMediaQuery('only screen and (max-width : 768px)')

    return (
      <Button
        aria-labelledby={labelId}
        className={clsx(
          'signalen-icon-button',
          className,
          isMobile ? '!p-3' : ''
        )}
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
