import React from 'react'
import { Link as LocaleLink } from '@/routing/navigation'
import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof LocaleLink>

export interface ButtonLinkProps
  extends Pick<LinkProps, 'href' | 'target' | 'rel' | 'prefetch'> {
  children: React.ReactNode
  purpose?: 'primary' | 'secondary' | 'subtle'
  iconOnly?: boolean
  iconStart?: React.ReactNode
  iconEnd?: React.ReactNode
  className?: string
}

export const ButtonLink = ({
  href,
  target,
  rel,
  prefetch,
  children,
  purpose = 'primary',
  iconOnly = false,
  iconStart,
  iconEnd,
  className,
}: ButtonLinkProps) => {
  const buttonClassName = clsx(
    'nl-button',
    purpose === 'primary' && 'nl-button--primary',
    purpose === 'secondary' && 'nl-button--secondary',
    purpose === 'subtle' && 'nl-button--subtle',
    iconOnly && 'nl-button--icon-only',
    className
  )

  return (
    <LocaleLink
      href={href}
      target={target}
      rel={rel}
      prefetch={prefetch}
      className={buttonClassName}
    >
      {iconStart && <span className="nl-button__icon-start">{iconStart}</span>}
      <span className="nl-button__label">{children}</span>
      {iconEnd && <span className="nl-button__icon-end">{iconEnd}</span>}
    </LocaleLink>
  )
}
