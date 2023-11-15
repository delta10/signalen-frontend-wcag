import * as Dialog from '@radix-ui/react-dialog'
import { TbPlus } from 'react-icons/tb'
import React, { useState } from 'react'
import Map, {
  LngLat,
  MapLayerMouseEvent,
  Marker,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import Lng_lat from '@maplibre/maplibre-gl-style-spec/src/coordinates/lng_lat'

type MapDialogProps = {
  trigger: React.ReactElement
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({ trigger }: MapDialogProps) => {
  const t = useTranslations('describe-add.map')

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
  const [marker, setMarker] = useState<{ lng: number; lat: number }>({
    lng: 0,
    lat: 0,
  })

  const handleMapClick = (event: MapLayerMouseEvent) => {
    setMarker({ lng: event.lngLat.lng, lat: event.lngLat.lat })
    setViewState({ ...viewState, zoom: 16 })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed inset-0 bg-white z-[1000] grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-1 p-4">
            <Dialog.Title>
              <h1>{t('map_heading')}</h1>
            </Dialog.Title>
          </div>
          <div className="col-span-1 md:col-span-2">
            <Map
              {...viewState}
              onClick={(e) => handleMapClick(e)}
              onMove={(evt) => setViewState(evt.viewState)}
              style={{ width: '100%', height: '100%' }}
              mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
            >
              <Marker longitude={marker.lng} latitude={marker.lat}></Marker>
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
