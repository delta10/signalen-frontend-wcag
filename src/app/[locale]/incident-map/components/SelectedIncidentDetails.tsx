import React from 'react'
import { Address } from '@/types/form'
import { Feature } from 'geojson'

type SelectedIncidentDetailsProps = {
  feature?: Feature
  address: Address | null
}

const SelectedIncidentDetails = ({
  feature,
  address,
}: SelectedIncidentDetailsProps) => {
  return (
    <dl>
      {/*todo: add close button*/}
      <dt>Melding</dt>
      <h2>{feature?.properties?.category.name}</h2>
      <dt>Datum melding</dt>
      <dd>{feature?.properties?.created_at}</dd>

      {address && (
        <>
          <dt>Adress dichtbij</dt>
          <dt>{address.weergave_naam}</dt>
        </>
      )}
    </dl>
  )
}

export default SelectedIncidentDetails
