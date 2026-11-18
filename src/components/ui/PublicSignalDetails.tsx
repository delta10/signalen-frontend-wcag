import type { Feature } from 'geojson'
import { useLocale, useTranslations } from 'next-intl'
import { IconX } from '@tabler/icons-react'
import type { Address } from '@/types/form'
import './PublicSignals.css'

type PublicSignalDetailsProps = {
  feature?: Feature
  address?: Address | null
  onClose: () => void
  compact?: boolean
}

export const PublicSignalDetails = ({
  feature,
  address,
  onClose,
  compact = false,
}: PublicSignalDetailsProps) => {
  const t = useTranslations('incident_map')
  const tGeneral = useTranslations('general.button')
  const locale = useLocale()
  const createdAt = feature?.properties?.created_at
  const date = createdAt ? new Date(createdAt) : null
  const valueClass = compact ? 'font-bold' : 'text-xl font-bold'

  return (
    <dl className={compact ? 'space-y-2' : 'space-y-4'}>
      <div className="flex justify-between items-start gap-2 w-full">
        <div>
          <dt>{t('report')}</dt>
          <dd className={valueClass}>{feature?.properties?.category?.name}</dd>
        </div>
        <button
          type="button"
          className="public-signal-close"
          aria-label={tGeneral('close')}
          onClick={onClose}
        >
          <IconX size={20} aria-hidden="true" />
        </button>
      </div>
      {date && Number.isFinite(date.getTime()) && (
        <div>
          <dt>{t('report_date')}</dt>
          <dd className={compact ? undefined : valueClass}>
            <time dateTime={createdAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
                date
              )}
            </time>
          </dd>
        </div>
      )}
      {address && (
        <div>
          <dt>{t('address_nearby')}</dt>
          <dd className={valueClass}>{address.weergave_naam}</dd>
        </div>
      )}
    </dl>
  )
}
