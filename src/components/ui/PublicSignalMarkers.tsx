import NextImage from 'next/image'
import { IconMapPinFilled } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { Marker } from 'react-map-gl/maplibre'
import type { PublicSignal } from '@/hooks/usePublicSignals'
import type { ParentCategory } from '@/types/category'
import './PublicSignals.css'

type PublicSignalMarkersProps = {
  signals: PublicSignal[]
  categories: ParentCategory[]
  selectedSignalId: string | null
  onSelect: (signal: PublicSignal, button: HTMLButtonElement) => void
}

export const PublicSignalMarkers = ({
  signals,
  categories,
  selectedSignalId,
  onSelect,
}: PublicSignalMarkersProps) => {
  const t = useTranslations('describe_add.map')

  return signals.map((signal) => {
    const category = signal.properties.category
    const parent = categories.find(
      (item) => item.slug === category.parent?.slug
    )
    const iconCategory = parent?.configuration?.show_children_in_filter
      ? parent.sub_categories?.find((item) => item.slug === category.slug)
      : parent
    const iconUrl =
      signal.internal_id === selectedSignalId
        ? '/assets/images/feature-selected-marker.svg'
        : iconCategory?._links?.['sia:icon']?.href
    const label = t('existing_report_label', { category: category.name })

    return (
      <Marker
        key={signal.internal_id}
        longitude={signal.geometry.coordinates[0]}
        latitude={signal.geometry.coordinates[1]}
        style={{ zIndex: 0 }}
        onClick={(event) => event.originalEvent.stopPropagation()}
      >
        <button
          type="button"
          className="public-signal-marker"
          aria-label={label}
          title={label}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ')
              event.stopPropagation()
          }}
          onClick={(event) => {
            event.stopPropagation()
            onSelect(signal, event.currentTarget)
          }}
        >
          {iconUrl ? (
            <NextImage
              unoptimized
              src={iconUrl}
              width={28}
              height={28}
              alt=""
            />
          ) : (
            <IconMapPinFilled size={28} aria-hidden="true" />
          )}
        </button>
      </Marker>
    )
  })
}
