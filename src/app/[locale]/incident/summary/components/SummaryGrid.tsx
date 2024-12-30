import { HTMLAttributes, PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import './SummaryGrid.css'

export const SummaryGrid = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={clsx('summary-grid', className)}>{children}</div>
)

export const SummaryGridMain = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={clsx('summary-grid__main', className)}>{children}</div>
)

export const SummaryGridLink = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={clsx('summary-grid__link', className)}>{children}</div>
)

export const SummaryGridHeading = ({
  children,
  className,
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={clsx('summary-grid__heading', className)}>{children}</div>
)
