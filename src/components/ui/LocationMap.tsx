import Map, { Marker, ViewState } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useState } from 'react'
import { useFormStore } from '@/store/form_store'

/* TODO: Use center coordinates as configured in config.json */
const LocationMap = () => {
  const { formState } = useFormStore()
  const [viewState, setViewState] = useState<ViewState>({
    longitude:
      formState.coordinates[0] !== 0 ? formState.coordinates[0] : 5.10448,
    latitude:
      formState.coordinates[1] !== 0 ? formState.coordinates[1] : 52.092876,
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

  const marker = formState.coordinates

  useEffect(() => {
    if (formState.coordinates[0] !== 0 && formState.coordinates[1] !== 0) {
      setViewState({
        ...viewState,
        longitude: formState.coordinates[0],
        latitude: formState.coordinates[1],
      })
    }
  }, [formState.coordinates])

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
      {marker[0] !== 0 && marker[1] !== 0 ? (
        <Marker longitude={marker[0]} latitude={marker[1]}></Marker>
      ) : null}
    </Map>
  )
}

export { LocationMap }
