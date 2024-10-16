import * as Dialog from '@radix-ui/react-dialog'
import { TbPlus } from 'react-icons/tb'
import React, { useState } from 'react'
import Map, {
  MapLayerMouseEvent,
  Marker,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import { useSignalStore } from '@/store/store'
import { _NestedLocationModel } from '@/services/client'
import { AddressSelect } from '@/app/[locale]/incident/add/components/AddressSelect'

type MapDialogProps = {
  trigger: React.ReactElement
  marker: Array<number>
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({ trigger, marker }: MapDialogProps) => {
  const t = useTranslations('describe-add.map')
  const { updateSignal, signal } = useSignalStore()

  const [viewState, setViewState] = useState<ViewState>({
    longitude: 5.10448,
    latitude: 52.092876,
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

  const handleMapClick = (event: MapLayerMouseEvent) => {
    updateSignal({
      ...signal,
      location: {
        ...signal.location,
        geometrie: {
          type: _NestedLocationModel.type.POINT,
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        },
      },
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
          <div className="col-span-1 p-4 flex flex-col gap-4">
            <h1>{t('map_heading')}</h1>
            <AddressSelect />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Map
              {...viewState}
              onClick={(e) => handleMapClick(e)}
              onMove={(evt) => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            >
              <Marker longitude={marker[0]} latitude={marker[1]}></Marker>
            </Map>
            <div className="fixed right-0 top-0 p-4 bg-white mt-4 mr-4 w-12 h-12 flex items-center justify-center text-2xl text-black border-border border-2">
              <Dialog.Close className="rotate-45">
                <TbPlus />
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { MapDialog }
