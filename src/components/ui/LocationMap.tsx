import { Marker, ViewState } from 'react-map-gl/maplibre'
import { Map } from './Map'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect, useMemo, useState } from 'react'
import { useFormStore } from '@/store/form_store'
import { useConfig } from '@/contexts/ConfigContext'
import { MapMarker } from './MapMarker'
import { useDarkMode } from '@/hooks/useDarkMode'

const LocationMap = () => {
  const { formState } = useFormStore()
  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const [viewState, setViewState] = useState<ViewState>({
    latitude: config.base.map.center[0],
    longitude: config.base.map.center[1],
    zoom: formState.address
      ? config.base.map.minimal_zoom || 17
      : config.base.map.default_zoom || 12,
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  // Memoize marker coordinates, dependent on formState.coordinates
  const marker = useMemo(() => {
    return [formState.coordinates[0], formState.coordinates[1]]
  }, [formState.coordinates])

  // Update viewState, to move map view with marker
  useEffect(() => {
    if (marker[0] === 0 && marker[1] === 0) {
      return
    }

    setViewState((state) => ({
      ...state,
      latitude: marker[0],
      longitude: marker[1],
      zoom: formState.address
        ? config.base.map.minimal_zoom || 17
        : config.base.map.default_zoom || 12,
    }))
  }, [marker])

  const mapStyle = isDarkMode
    ? `${process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
    : `${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

  return (
    <Map
      {...viewState}
      id="locationMap"
      scrollZoom={false}
      doubleClickZoom={false}
      dragPan={false}
      keyboard={false}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: '100%', height: 200 }}
      mapStyle={mapStyle}
      attributionControl={false}
      onLoad={() => {
        const mapCanvas = document.getElementsByClassName(
          'maplibregl-canvas'
        )[0] as HTMLCanvasElement

        mapCanvas.tabIndex = -1
        mapCanvas.classList.add('dashed-focus')
      }}
    >
      <Marker latitude={marker[0]} longitude={marker[1]}>
        <MapMarker />
      </Marker>
    </Map>
  )
}

export { LocationMap }
