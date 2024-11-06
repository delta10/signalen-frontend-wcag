'use client'

import clsx from 'clsx'
import {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react'
import { Icon, LinkButton } from '@/components/index'
import { IconPlus } from '@tabler/icons-react'

export type AlertType = 'info' | 'ok' | 'warning' | 'error'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode
  type?: string | AlertType
  visible: boolean
  setVisibility: (value: boolean) => void
}

export const ClosableAlert = forwardRef(
  (
    {
      children,
      className,
      icon,
      type,
      visible = false,
      setVisibility,
      ...restProps
    }: PropsWithChildren<AlertProps>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const handleClose = () => {
      setVisibility(false)
    }

    if (!visible) return null

    return (
      <div
        {...restProps}
        ref={ref}
        className={clsx(
          'utrecht-alert',
          {
            'utrecht-alert--error': type === 'error',
            'utrecht-alert--info': type === 'info',
            'utrecht-alert--ok': type === 'ok',
            'utrecht-alert--warning': type === 'warning',
          },
          className
        )}
      >
        {icon && <div className="utrecht-alert__icon">{icon}</div>}
        <div className="utrecht-alert__content utrecht-alert__content-closable">
          <div className="utrecht-alert__message" role="alert">
            {children}
          </div>
          <LinkButton
            inline={true}
            onClick={handleClose}
            aria-label="Sluit melding"
          >
            <Icon className="utrecht-alert-closable__icon">
              <IconPlus />
            </Icon>
          </LinkButton>
        </div>
      </div>
    )
  }
)

ClosableAlert.displayName = 'ClosableAlert'
