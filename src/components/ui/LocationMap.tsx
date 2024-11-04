import Map, { Marker, ViewState } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useState } from 'react'
import { useFormStore } from '@/store/form_store'

const LocationMap = () => {
  const { formState } = useFormStore()
  const [viewState, setViewState] = useState<ViewState>({
    latitude: formState.coordinates[0],
    longitude: formState.coordinates[1],
    zoom: 14,
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  return (
    <Map
      {...viewState}
      scrollZoom={false}
      doubleClickZoom={false}
      dragPan={false}
      keyboard={false}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: '100%', height: 200 }}
      mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
    >
      <Marker
        latitude={viewState.latitude}
        longitude={viewState.longitude}
      ></Marker>
    </Map>
  )
}

export { LocationMap }
