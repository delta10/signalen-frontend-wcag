'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Marker, useMap, ViewState } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import { Button, ButtonGroup, IconButton, MapMarker } from '@/components'
import { useConfig } from '@/contexts/ConfigContext'
import { Map } from '@/components/ui/Map'
import { IconCurrentLocation, IconMinus, IconPlus } from '@tabler/icons-react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useWindowSize } from 'usehooks-ts'
import { Feature, FeatureCollection } from 'geojson'
import { signalsClient } from '@/services/client/api-client'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { Paragraph } from '@amsterdam/design-system-react'
import { Category, ParentCategory } from '@/types/category'
import { isCoordinateInsideMaxBound } from '@/lib/utils/map'

export type IncidentMapProps = {
  prop?: string
} & React.HTMLAttributes<HTMLDivElement>

const IncidentMapContent = ({}: IncidentMapProps) => {
  const t = useTranslations('describe_add.map')
  const { dialogMap } = useMap()
  const [features, setFeatures] = useState<FeatureCollection | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  )
  const [error, setError] = useState<string | null>(null)

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
            features: res.features,
          }
          console.log(featureCollection)
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

  // Filter features based on selected categories
  const filteredFeatures = useMemo(() => {
    // If no filters are selected, show all features
    if (selectedSubCategories.length === 0) {
      return features?.features
    }

    return features?.features.filter((feature) => {
      const featureCategory = feature.properties?.category
      if (!featureCategory) return false

      // Check if subcategory is directly selected
      if (selectedSubCategories.includes(featureCategory.slug)) {
        return true
      }

      // Check if parent category is selected
      return false
    })
  }, [features, selectedSubCategories])

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await signalsClient.v1.v1PublicTermsCategoriesList()
        if (res?.results) {
          // @ts-ignore
          let categories: ParentCategory[] = res.results as ParentCategory[]

          // Filter out non-public categories
          categories = categories.filter(
            (category) => category.is_public_accessible
          )
          setCategories(categories)
        }
      } catch (e) {
        console.error(e)
      }
    }

    getCategories()
  }, [])

  // Update position, flyTo position, after this set the marker position
  const updatePosition = (lat: number, lng: number) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [lng, lat],
        zoom: Math.max(config.base.map.minimal_zoom || 17, dialogMap.getZoom()),
      })
    }
  }

  // set current location of user
  const setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const isInsideMaxBound = isCoordinateInsideMaxBound(
          position.coords.latitude,
          position.coords.longitude,
          config
            ? config.base.map.maxBounds
            : [
                [0, 0],
                [0, 0],
              ]
        )

        if (isInsideMaxBound) {
          updatePosition(position.coords.latitude, position.coords.longitude)
          setError(null)
          return
        }

        setError(t('outside_max_bound_error'))
      },
      (locationError) => {
        // For documentation see: https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError.
        // We map a custom error message here to the locationError.code
        const locationErrors: { [key: number]: string } = {
          1: t('current_location_permission_error'),
          2: t('current_location_position_error'),
          3: t('current_location_timeout_error'),
        }

        setError(locationErrors[locationError.code])
      }
    )
  }

  const mapStyle = isDarkMode
    ? `${process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
    : `${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

  return (
    <>
      <div className="col-span-1 flex flex-col md:max-h-screen gap-4 min-h-[calc(100vh-8em)] p-4">
        <Paragraph>
          Op deze kaart staan meldingen in de openbare ruimte waarmee we aan het
          werk zijn. Vanwege privacy staat een klein deel van de meldingen niet
          op de kaart.
        </Paragraph>
        <div>
          {/*<div className="flex flex-col py-2">*/}
          {/*  <label htmlFor="address">{t('search_address_label')}</label>*/}
          {/*  <AddressCombobox*/}
          {/*    updatePosition={updatePosition}*/}
          {/*    setIsMapSelected={setIsMapSelected}*/}
          {/*  />*/}
          {/*</div>*/}

          {categories && categories.length > 0 && (
            <NestedCategoryCheckboxList
              categories={categories}
              selectedSubCategories={selectedSubCategories}
              setSelectedSubCategories={setSelectedSubCategories}
            />
          )}
        </div>
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
            {filteredFeatures &&
              filteredFeatures.map((feature: Feature, index) => {
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
          <div className="map-location-group">
            <Button
              appearance="secondary-action-button"
              onClick={() => setCurrentLocation()}
            >
              <IconCurrentLocation />
              {t('current_location')}
            </Button>
          </div>

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
