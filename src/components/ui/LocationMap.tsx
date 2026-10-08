import { Marker, ViewState } from 'react-map-gl/maplibre'
import { Map } from './Map'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { useFormStore } from '@/store/form_store'
import { useConfig } from '@/contexts/ConfigContext'
import { MapMarker } from './MapMarker'
import { useDarkMode } from '@/hooks/useDarkMode'
import { getMapAttribution, getMapStyleUrl } from '@/lib/utils/map'
import { MapAttribution } from './MapAttribution'

type LocationMapProps = React.HTMLAttributes<HTMLDivElement> & {
  searchPosition?: [number, number] | null
}

const LocationMap = ({
  searchPosition,
  ...mapImageProps
}: LocationMapProps = {}) => {
  const { formState } = useFormStore()
  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const marker = [formState.coordinates[0], formState.coordinates[1]]
  const viewState: ViewState = {
    latitude: searchPosition?.[0] ?? (marker[0] || config.base.map.center[0]),
    longitude: searchPosition?.[1] ?? (marker[1] || config.base.map.center[1]),
    zoom: searchPosition
      ? 14
      : formState.address
        ? config.base.map.minimal_zoom || 17
        : config.base.map.default_zoom || 12,
    bearing: 0,
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
    pitch: 0,
  }

  return (
    <div className="location-map-preview relative">
      <div
        {...mapImageProps}
        role="img"
        aria-label={mapImageProps['aria-label'] ?? ''}
      >
        <Map
          {...viewState}
          id="locationMap"
          scrollZoom={false}
          doubleClickZoom={false}
          dragPan={false}
          keyboard={false}
          style={{ width: '100%', height: 200 }}
          mapStyle={getMapStyleUrl(config, isDarkMode)}
          attributionControl={false}
          onLoad={() => {
            const mapCanvas = document.getElementsByClassName(
              'maplibregl-canvas'
            )[0] as HTMLCanvasElement

            mapCanvas.tabIndex = -1
            mapCanvas.classList.add('dashed-focus')
          }}
        >
          {marker[0] !== 0 && marker[1] !== 0 && (
            <Marker latitude={marker[0]} longitude={marker[1]}>
              <MapMarker />
            </Marker>
          )}
        </Map>
      </div>
      <MapAttribution attribution={getMapAttribution(config)} />
    </div>
  )
}

export { LocationMap }
