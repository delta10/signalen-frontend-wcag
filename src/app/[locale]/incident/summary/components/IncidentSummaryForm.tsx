'use client'

import { IncidentFormFooter } from '@/app/[locale]/incident/components/IncidentFormFooter'
import { useTranslations } from 'next-intl'
import { Divider } from '@/components/ui/Divider'
import { LinkWrapper } from '@/components/ui/LinkWrapper'
import { useSignalStore, useStepperStore } from '@/store/store'
import React from 'react'
import { LocationMap } from '@/components/ui/LocationMap'

const IncidentSummaryForm = () => {
  const t = useTranslations('describe-summary')
  const { signal } = useSignalStore()
  const { goToStep } = useStepperStore()

  return (
    <div className="flex flex-col gap-8">
      <p>{t('description')}</p>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <h3>{t('steps.step_one.title')}</h3>
          <LinkWrapper href={'/incident'} onClick={() => goToStep(1)}>
            {t('steps.step_one.edit')}
          </LinkWrapper>
        </div>
        <IncidentSummaryFormItem
          title={t('steps.step_one.input_heading')}
          value={signal.text}
        />
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <h3>{t('steps.step_two.title')}</h3>
          <LinkWrapper href={'/incident/add'} onClick={() => goToStep(2)}>
            {t('steps.step_two.edit')}
          </LinkWrapper>
        </div>
        <IncidentSummaryFormItem title={t('steps.step_two.input_heading')}>
          <LocationMap />
        </IncidentSummaryFormItem>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between">
          <h3>{t('steps.step_three.title')}</h3>
          <LinkWrapper href={'/incident/contact'} onClick={() => goToStep(3)}>
            {t('steps.step_three.edit')}
          </LinkWrapper>
        </div>
        {signal.reporter.phone === undefined &&
        signal.reporter.email === undefined &&
        signal.reporter.sharing_allowed === false ? (
          <p>{t('steps.step_three.no_contact_details')}</p>
        ) : (
          <>
            {signal.reporter.phone !== undefined &&
            signal.reporter.phone !== null ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_telephone_heading')}
                value={signal.reporter.phone}
              />
            ) : null}
            {signal.reporter.email !== undefined &&
            signal.reporter.email !== null ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_mail_heading')}
                value={signal.reporter.email}
              />
            ) : null}
            {signal.reporter.sharing_allowed ? (
              <IncidentSummaryFormItem
                title={t('steps.step_three.input_sharing_heading')}
                value={t('steps.step_three.input_sharing_allowed')}
              />
            ) : null}
          </>
        )}
      </div>
      <IncidentFormFooter />
    </div>
  )
}

export const IncidentSummaryFormItem = ({
  title,
  value = '',
  children,
}: {
  title: string
  value?: string
  children?: React.ReactElement
}) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold">{title}</p>
      {value !== '' ? <p>{value}</p> : <div className="mt-2">{children}</div>}
    </div>
  )
}

export { IncidentSummaryForm }
