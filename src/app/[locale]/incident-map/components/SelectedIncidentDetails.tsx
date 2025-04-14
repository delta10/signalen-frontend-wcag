import React from 'react'
import { Address } from '@/types/form'
import { Feature } from 'geojson'
import { useTranslations } from 'next-intl'
import { Icon } from '@/components'
import { IconX } from '@tabler/icons-react'

type SelectedIncidentDetailsProps = {
  feature?: Feature
  address: Address | null
  onClose: () => void
}

const SelectedIncidentDetails = ({
  feature,
  address,
  onClose,
}: SelectedIncidentDetailsProps) => {
  const t = useTranslations('incident_map')

  // Could be moved to util class but this is currently the only place it is used.
  const formatDateToDutch = (isoString: string): string => {
    if (!isoString) {
      return ''
    }

    const date = new Date(isoString)

    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  return (
    <dl className="space-y-4">
      <div className="flex justify-between w-full">
        <div>
          <dt>{t('report')}</dt>
          <dd className="text-xl font-bold">
            {feature?.properties?.category.name}
          </dd>
        </div>
        <button
          className="mr-2 p-1 text-gray-600 hover:text-black"
          onClick={() => onClose()}
        >
          <Icon>
            <IconX />
          </Icon>
        </button>
      </div>

      <div>
        <dt>{t('report_date')}</dt>
        <dd className="text-xl font-bold">
          {formatDateToDutch(feature?.properties?.created_at)}
        </dd>
      </div>

      {address && (
        <div>
          <dt>{t('address_nearby')}</dt>
          <dd className="text-xl font-bold">{address.weergave_naam}</dd>
        </div>
      )}
    </dl>
  )
}

export default SelectedIncidentDetails
