import React from 'react'
import { Address } from '@/types/form'
import { Feature } from 'geojson'
import { useTranslations } from 'next-intl'

type SelectedIncidentDetailsProps = {
  feature?: Feature
  address: Address | null
}

const SelectedIncidentDetails = ({
  feature,
  address,
}: SelectedIncidentDetailsProps) => {
  const t = useTranslations('incident_map')

  return (
    <dl>
      {/*todo: add close button*/}
      <dt>{t('report')}</dt>
      <h2>{feature?.properties?.category.name}</h2>
      <dt>{t('report_date')}</dt>
      <dd>{feature?.properties?.created_at}</dd>

      {address && (
        <>
          <dt>{t('address_nearby')}</dt>
          <dt>{address.weergave_naam}</dt>
        </>
      )}
    </dl>
  )
}

export default SelectedIncidentDetails
