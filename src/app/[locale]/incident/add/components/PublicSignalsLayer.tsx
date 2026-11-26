import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Popup, useMap } from 'react-map-gl/maplibre'
import { usePublicSignals } from '@/hooks/usePublicSignals'
import { PublicSignalMarkers } from '@/components/ui/PublicSignalMarkers'
import { PublicSignalDetails } from '@/components/ui/PublicSignalDetails'
import { useFormStore } from '@/store/form_store'

export const PublicSignalsLayer = () => {
  const { current: map } = useMap()
  const mainCategory = useFormStore((state) => state.formState.main_category)
  const subCategory = useFormStore((state) => state.formState.sub_category)
  const { signals, categories, loadError } = usePublicSignals(map, {
    mainCategory,
    subCategory,
  })
  const t = useTranslations('describe_add.map')
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null)
  const selectedButton = useRef<HTMLButtonElement | null>(null)
  const selectedSignal = signals.find(
    (signal) => signal.internal_id === selectedSignalId
  )

  const closeDetails = () => {
    setSelectedSignalId(null)
    selectedButton.current?.focus()
  }

  return (
    <>
      {loadError && (
        <div className="public-signals-status" role="status">
          {t('existing_reports_unavailable')}
        </div>
      )}
      <PublicSignalMarkers
        signals={signals}
        categories={categories}
        selectedSignalId={selectedSignalId}
        onSelect={(signal, button) => {
          selectedButton.current = button
          setSelectedSignalId(signal.internal_id)
        }}
      />
      {selectedSignal && (
        <Popup
          longitude={selectedSignal.geometry.coordinates[0]}
          latitude={selectedSignal.geometry.coordinates[1]}
          offset={24}
          maxWidth="280px"
          closeButton={false}
          onClose={closeDetails}
          className="public-signal-popup"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (['Enter', ' ', 'Escape'].includes(event.key))
                event.stopPropagation()
              if (event.key === 'Escape') closeDetails()
            }}
          >
            <PublicSignalDetails
              feature={selectedSignal}
              onClose={closeDetails}
              compact
            />
          </div>
        </Popup>
      )}
    </>
  )
}
