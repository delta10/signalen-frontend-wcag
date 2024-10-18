import Map, { Marker, ViewState } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useState } from 'react'
import { useSignalStore } from '@/store/store'

const LocationMap = () => {
  const { signal } = useSignalStore()
  const [viewState, setViewState] = useState<ViewState>({
    longitude:
      signal.location.geometrie.coordinates![0] !== 0
        ? signal.location.geometrie.coordinates![0]
        : 5.10448,
    latitude:
      signal.location.geometrie.coordinates![1] !== 0
        ? signal.location.geometrie.coordinates![1]
        : 52.092876,
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

  const marker = signal.location.geometrie.coordinates!

  useEffect(() => {
    if (
      signal.location.geometrie.coordinates![0] !== 0 &&
      signal.location.geometrie.coordinates![1] !== 0
    ) {
      setViewState({
        ...viewState,
        longitude: signal.location.geometrie.coordinates![0],
        latitude: signal.location.geometrie.coordinates![1],
      })
    }
  }, [signal.location.geometrie.coordinates])

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
