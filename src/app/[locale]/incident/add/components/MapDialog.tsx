import * as Dialog from '@radix-ui/react-dialog'
import React, { useMemo, useState } from 'react'
import Map, {
  MapLayerMouseEvent,
  Marker,
  useMap,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useFormStore } from '@/store/form_store'
import { Heading } from '@/components/index'
import { Button } from '@/components/ui/Button'

type MapDialogProps = {
  trigger: React.ReactElement
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({ trigger }: MapDialogProps) => {
  const t = useTranslations('describe-add.map')
  const { updateForm, formState } = useFormStore()
  const { dialogMap } = useMap()

  const [viewState, setViewState] = useState<ViewState>({
    latitude: formState.coordinates[0],
    longitude: formState.coordinates[1],
    zoom: 15,
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  const marker = useMemo(() => {
    return formState.coordinates
  }, [formState.coordinates])

  const handleMapClick = (event: MapLayerMouseEvent) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [event.lngLat.lng, event.lngLat.lat],
        speed: 0.5,
        zoom: 18,
      })
    }

    updateForm({
      ...formState,
      coordinates: [event.lngLat.lat, event.lngLat.lng],
    })

    setViewState({
      ...viewState,
      zoom: 16,
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
    })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed inset-0 bg-white z-[1000] grid grid-cols-1 md:grid-cols-3">
          <VisuallyHidden.Root>
            {/* TODO: Overleggen welke titel hier het meest vriendelijk is voor de gebruiker, multi-language support integreren */}
            <Dialog.Title>Locatie kiezen</Dialog.Title>
            <Dialog.Description>
              Kies een locatie op de kaart voor de locatie van uw melding.
            </Dialog.Description>
          </VisuallyHidden.Root>
          <div className="col-span-1 p-4 flex flex-col justify-between gap-4">
            <div>
              <Heading level={1}>{t('map_heading')}</Heading>
            </div>
            <div>
              <Dialog.Close>
                <Button>Kies locatie</Button>
              </Dialog.Close>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <Map
              {...viewState}
              id="dialogMap"
              onClick={(e) => handleMapClick(e)}
              onMove={(evt) => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
              attributionControl={false}
            >
              <Marker latitude={marker[0]} longitude={marker[1]}></Marker>
            </Map>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { MapDialog }
