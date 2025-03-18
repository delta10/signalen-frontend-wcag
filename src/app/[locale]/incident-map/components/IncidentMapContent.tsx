'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Marker, useMap, ViewState } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import {
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  MapMarker,
} from '@/components'
import * as Dialog from '@radix-ui/react-dialog'
import { useConfig } from '@/contexts/ConfigContext'
import { Map } from '@/components/ui/Map'
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useWindowSize } from 'usehooks-ts'
import { Feature, FeatureCollection } from 'geojson'
import { signalsClient } from '@/services/client/api-client'

export type IncidentMapProps = {
  prop?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentMapContent = ({}: IncidentMapProps) => {
  // nieuwe toevoegen
  const t = useTranslations('describe_add.map')
  const { dialogMap } = useMap()
  const [features, setFeatures] = useState<FeatureCollection | null>(null)

  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const { width = 0 } = useWindowSize()

  const [viewState, setViewState] = useState<ViewState>({
    latitude: config.base.map.center[0],
    longitude: config.base.map.center[1],
    zoom: config.base.map.default_zoom || 12,
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Set new features on map move or zoom
  useEffect(() => {
    const setNewFeatures = async () => {
      // todo: loading state
      // todo: kijken hoe minder vaak aanroepen

      const bounds = dialogMap?.getBounds()

      // Extract the bounding box in [minLon, minLat, maxLon, maxLat] format
      const bbox = [
        bounds?.getWest(),
        bounds?.getSouth(),
        bounds?.getEast(),
        bounds?.getNorth(),
      ].join(',')

      try {
        const res =
          await signalsClient.v1.v1PublicSignalsGeographyRetrieve(bbox)
        if (res && res.features) {
          // Wrap response in a FeatureCollection
          const featureCollection: FeatureCollection = {
            type: 'FeatureCollection',
            // todo: ts-ignore weg?
            // @ts-ignore
            features: res.features, // API returns an array of features
          }
          setFeatures(featureCollection)
        }
      } catch (e) {}
    }

    if (dialogMap) {
      dialogMap.on('load', setNewFeatures)
      dialogMap.on('moveend', () => {
        // setLoadingAssets(false)
      })
      dialogMap.on('move', setNewFeatures)
    }

    return () => {
      if (dialogMap) {
        dialogMap.off('load', setNewFeatures)
        dialogMap.off('move', setNewFeatures)
      }
    }
  }, [dialogMap])

  const mapStyle = isDarkMode
    ? `${process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
    : `${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

  return (
    <>
      <div className="col-span-1 flex flex-col md:max-h-screen gap-4 min-h-[calc(100vh-8em)]">
        <div className="p-4">
          <Heading level={1}>Meldingenkaart</Heading>

          {/*<div className="flex flex-col py-2">*/}
          {/*  <label htmlFor="address">{t('search_address_label')}</label>*/}
          {/*  <AddressCombobox*/}
          {/*    updatePosition={updatePosition}*/}
          {/*    setIsMapSelected={setIsMapSelected}*/}
          {/*  />*/}
          {/*</div>*/}
        </div>
        {/*<Dialog.Close className="flex items-end" asChild>*/}
        {/*  <Button*/}
        {/*    appearance="primary-action-button"*/}
        {/*    className="ml-4 mr-4 mb-4"*/}
        {/*    type="button"*/}
        {/*  >*/}
        {/*    sluitknops*/}
        {/*  </Button>*/}
        {/*</Dialog.Close>*/}
      </div>
      {config && (
        <div
          className="col-span-1 md:col-span-2 md:max-h-screen relative min-h-[calc(100vh-8em)]"
          ref={mapContainerRef}
        >
          <Map
            {...viewState}
            id="dialogMap"
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ blockSize: '100%', inlineSize: '100%' }}
            mapStyle={mapStyle}
            scrollZoom={!(width !== 0 && width < 768)}
            attributionControl={false}
            maxBounds={
              config.base.map.maxBounds as [[number, number], [number, number]]
            }
          >
            {features?.features.map((feature: Feature, index) => {
              return (
                <Marker
                  key={index}
                  // @ts-ignore
                  longitude={feature.geometry?.coordinates[0]}
                  // @ts-ignore
                  latitude={feature.geometry?.coordinates[1]}
                  // @ts-ignore
                  onClick={(e) => handleFeatureMarkerClick(e, feature)}
                >
                  <MapMarker />
                </Marker>
              )
            })}
          </Map>
          {/*<div className="map-location-group">*/}
          {/*  <Button*/}
          {/*    appearance="secondary-action-button"*/}
          {/*    onClick={() => setCurrentLocation()}*/}
          {/*  >*/}
          {/*    <IconCurrentLocation />*/}
          {/*    {t('current_location')}*/}
          {/*  </Button>*/}
          {/*</div>*/}

          {/*<Dialog.Close asChild>*/}
          {/*  <IconButton*/}
          {/*    appearance="secondary-action-button"*/}
          {/*    className="map-button map-close-button"*/}
          {/*    label={t('map_close_button_label')}*/}
          {/*  >*/}
          {/*    <IconX />*/}
          {/*  </IconButton>*/}
          {/*</Dialog.Close>*/}

          {dialogMap && (
            <ButtonGroup direction="column" className="map-zoom-button-group">
              <IconButton
                appearance="secondary-action-button"
                className="map-button map-zoom-button"
                onClick={() => dialogMap.zoomIn()}
                label={t('map_zoom-in_button_label')}
              >
                <IconPlus />
              </IconButton>
              <IconButton
                appearance="secondary-action-button"
                className="map-button map-zoom-button"
                onClick={() => dialogMap.zoomOut()}
                label={t('map_zoom-out_button_label')}
              >
                <IconMinus />
              </IconButton>
            </ButtonGroup>
          )}
        </div>
      )}
    </>
  )
}

export { IncidentMapContent }
