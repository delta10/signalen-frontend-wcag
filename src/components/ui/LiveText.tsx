'use client'

import { HTMLAttributes, PropsWithChildren, useState } from 'react'

export interface LiveTextProps extends HTMLAttributes<HTMLSpanElement> {
  delay?: number
}

const LiveText = ({
  children,
  delay = 1000,
  ...restProps
}: PropsWithChildren<LiveTextProps>) => {
  const [delayComplete, setDelayComplete] = useState(false)

  setTimeout(() => {
    setDelayComplete(true)
  }, delay)
  return delayComplete ? (
    <span {...restProps}>
      <span role="alert">{children}</span>
    </span>
  ) : (
    <span {...restProps}>{children}</span>
  )
}

export const AlertText = ({
  children,
  delay,
}: PropsWithChildren<LiveTextProps>) => (
  <LiveText role="alert" delay={delay}>
    {children}
  </LiveText>
)

export const StatusText = ({
  children,
  delay,
}: PropsWithChildren<LiveTextProps>) => (
  <LiveText role="status" delay={delay}>
    {children}
  </LiveText>
)
