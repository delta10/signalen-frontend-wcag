import Map, { ViewState } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'

const LocationMap = () => {
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 5.10448,
    latitude: 52.092876,
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
    />
  )
}

export { LocationMap }
