'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MapLayerMouseEvent,
  Marker,
  MarkerEvent,
  useMap,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import {
  AlertDialog,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  MapMarker,
  SpotlightSection,
} from '@/components'
import { useConfig } from '@/contexts/ConfigContext'
import { Map } from '@/components/ui/Map'
import {
  IconArrowRight,
  IconCurrentLocation,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useMediaQuery, useWindowSize } from 'usehooks-ts'
import { Feature, FeatureCollection } from 'geojson'
import { signalsClient } from '@/services/client/api-client'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { Category, ParentCategory } from '@/types/category'
import { AddressCombobox } from '@/components/ui/AddressCombobox'
import { getNewSelectedAddress } from '@/lib/utils/address'
import { generateFeatureId } from '@/lib/utils/features'
import SelectedIncidentDetails from '@/app/[locale]/incident-map/components/SelectedIncidentDetails'
import { Address } from '@/types/form'
import { AppConfig } from '@/types/config'
import { clsx } from 'clsx'
import { debounce } from 'lodash'
import IncidentMapMobileSidebar from '@/app/[locale]/incident-map/components/IncidentMapMobileSidebar'
import { setCurrentLocation } from '@/lib/utils/LocationUtils'
import { getMapStyleUrl } from '@/lib/utils/map'
import { ButtonLink } from '@utrecht/component-library-react'
import { Paragraph } from '@utrecht/component-library-react/dist/css-module'
import { ExtendedFeature } from '@/types/map'

const IncidentMapContent = () => {
  const t = useTranslations('describe_add.map')
  const tIncidentMap = useTranslations('incident_map')
  const { dialogMap } = useMap()
  const [features, setFeatures] = useState<ExtendedFeature[]>([])
  const [selectedFeatureId, setSelectedFeatureId] = useState<any>(null)
  const [selectedFeatureAddress, setSelectedFeatureAddress] =
    useState<Address | null>(null)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  )
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [error, setError] = useState<string | null>(null)

  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const { width = 0 } = useWindowSize()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')
  const lastBboxRef = useRef<string | null>(null)

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

  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Memoize the function with useCallback and include all dependencies
  const setNewFeatures = useCallback(async () => {
    if (!dialogMap) return

    const bounds = dialogMap.getBounds()

    if (!bounds) return

    // Extract the bounding box
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ].join(',')

    // Skip if the bbox hasn't changed
    if (bbox === lastBboxRef.current) return

    lastBboxRef.current = bbox

    try {
      const res = await signalsClient.v1.v1PublicSignalsGeographyRetrieve(bbox)
      if (res && res.features) {
        // Wrap response in a FeatureCollection
        const featureCollection: FeatureCollection = {
          type: 'FeatureCollection',
          // @ts-ignore
          features: res.features,
        }

        const featuresWithIds = featureCollection.features.map(
          (feature: Feature) => ({
            ...feature,
            internal_id: generateFeatureId(feature),
            properties: {
              ...feature.properties,
            },
          })
        )

        // @ts-ignore
        setFeatures(featuresWithIds)
      }
    } catch (e) {
      console.error('Error fetching features:', e)
    }
  }, [dialogMap, setFeatures])

  const debouncedSetNewFeatures = useCallback(
    debounce(() => {
      setNewFeatures()
    }, 50),
    [setNewFeatures]
  )

  useEffect(() => {
    if (!dialogMap) return

    const handleMapLoad = () => {
      setNewFeatures()
    }

    const handleMapMove = () => {
      debouncedSetNewFeatures()
    }

    // Attach event listeners
    dialogMap.on('load', handleMapLoad)
    dialogMap.on('move', handleMapMove)

    // Cleanup function
    return () => {
      if (dialogMap) {
        dialogMap.off('load', handleMapLoad)
        dialogMap.off('move', handleMapMove)
        debouncedSetNewFeatures.cancel() // Cancel any pending debounced calls
      }
    }
  }, [dialogMap, setNewFeatures, debouncedSetNewFeatures])

  // Filter features based on selected categories
  const filteredFeatures = useMemo(() => {
    // If no filters are selected, show all features
    if (selectedSubCategories.length === 0) {
      return features
    }

    return features.filter((feature: ExtendedFeature) => {
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

  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId || !features) {
      return
    }

    return features.find(
      (feature: ExtendedFeature) => feature.internal_id === selectedFeatureId
    )
  }, [selectedFeatureId])

  // Update position, flyTo position, after this set the marker position
  const updatePosition = (lat: number, lng: number) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [lng, lat],
      })
    }
  }

  // Handle click on map, setIsMapSelected to true
  const handleMapClick = async (event: MapLayerMouseEvent) => {
    updatePosition(event.lngLat.lat, event.lngLat.lng)
    resetSelectedIncident()
  }

  // Handle click on feature marker, set selectedFeatures and show error if maxNumberOfAssets is reached
  const handleFeatureMarkerClick = async (
    event: MarkerEvent,
    feature: ExtendedFeature
  ) => {
    // @ts-ignore
    event.originalEvent?.stopPropagation()
    setSelectedFeatureId(feature.internal_id)

    const address = await getNewSelectedAddress(
      event.target.getLngLat().lat,
      event.target.getLngLat().lng,
      config
    )

    setSelectedFeatureAddress(address)
  }

  const resetSelectedIncident = () => {
    setSelectedFeatureId(null)
    setSelectedFeatureAddress(null)
  }

  const getFeatureCategoryIcon = (feature: Feature): string | null => {
    const parentCategorySlug = feature.properties?.category.parent.slug
    const parentCategory = categories?.find(
      (category) => category.slug === parentCategorySlug
    )
    if (parentCategory) {
      // check if feature category is sub category
      // @ts-ignore
      if (parentCategory.configuration?.show_children_in_filter) {
        // @ts-ignore
        const subCategory = parentCategory.sub_categories.find(
          (category: Category) =>
            category.slug === feature.properties?.category.slug
        )

        return subCategory?._links?.['sia:icon']?.href || null
      }

      return parentCategory?._links?.['sia:icon']?.href || null
    }

    return null
  }

  if (!hasMounted) {
    // Prevents rendering anything until on client, this causes hydration errors when opening the page on mobile screens.
    return null
  }

  return (
    <div className="grid md:grid-cols-3 min-h-[calc(100svh-5.4rem)] md:min-h-[calc(100vh-102px)] overflow-y-hidden grid-rows-[auto_1fr_auto] md:grid-rows-[auto]">
      <AlertDialog type="error" ref={dialogRef}>
        <form
          method="dialog"
          className="map-alert-dialog__content md:!min-w-[400px] md:!max-w-[400px]"
        >
          {error}
          <ButtonGroup>
            <Button
              appearance="secondary-action-button"
              hint="danger"
              onClick={() => dialogRef.current?.close()}
            >
              {t('close_alert_notification')}
            </Button>
          </ButtonGroup>
        </form>
      </AlertDialog>
      {/*min-h-[calc(100svh-102px)]*/}
      {!isMobile && (
        <div className="col-span-1 flex flex-col shadow-right z-10 md:max-h-[calc(100vh-102px)] overflow-y-auto">
          {selectedFeatureId ? (
            <div className="p-4">
              <SelectedIncidentDetails
                feature={selectedFeature}
                address={selectedFeatureAddress}
                onClose={resetSelectedIncident}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <SpotlightSection type="info">
                <Paragraph> {tIncidentMap('description')}</Paragraph>
              </SpotlightSection>
              <div className="p-4 h-full">
                <div className="flex flex-col py-2 ">
                  <label htmlFor="address">{t('search_address_label')}</label>
                  <AddressCombobox updatePosition={updatePosition} />
                </div>
                {categories && categories.length > 0 && (
                  <NestedCategoryCheckboxList
                    categories={categories}
                    selectedSubCategories={selectedSubCategories}
                    setSelectedSubCategories={setSelectedSubCategories}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col gap-1 px-2 pb-2 shadow-bottom z-10">
          <div className="flex flex-col pb-2">
            <label htmlFor="address" className="!text-lg">
              {t('search_address_label')}
            </label>
            <AddressCombobox
              updatePosition={updatePosition}
              mobileView={true}
            />
          </div>
        </div>
      )}

      {config && (
        <div
          className="col-span-1 md:col-span-2 relative min-h-full max-h-full h-full"
          ref={mapContainerRef}
        >
          <Map
            {...viewState}
            id="dialogMap"
            onClick={(e) => handleMapClick(e)}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ blockSize: '100%', inlineSize: '100%' }}
            mapStyle={getMapStyleUrl(isDarkMode)}
            scrollZoom={!(width !== 0 && width < 768)}
            attributionControl={false}
            maxBounds={
              config.base.map.maxBounds as [[number, number], [number, number]]
            }
          >
            {filteredFeatures &&
              filteredFeatures.map((feature: ExtendedFeature) => {
                return (
                  <Marker
                    className="hover:cursor-pointer"
                    key={feature.internal_id}
                    // @ts-ignore
                    longitude={feature.geometry?.coordinates[0]}
                    // @ts-ignore
                    latitude={feature.geometry?.coordinates[1]}
                    // @ts-ignore
                    onClick={(e) => handleFeatureMarkerClick(e, feature)}
                  >
                    {FeatureCategoryIcon(
                      feature.internal_id,
                      selectedFeatureId,
                      getFeatureCategoryIcon(feature),
                      config
                    )}
                  </Marker>
                )
              })}
          </Map>
          <div className="map-location-group">
            <Button
              appearance="secondary-action-button"
              className={clsx(
                'map-zoom-button',
                isMobile ? 'map-icon-button mobile' : ''
              )}
              onClick={() =>
                setCurrentLocation(
                  config,
                  updatePosition,
                  setError,
                  dialogRef,
                  t
                )
              }
            >
              <IconCurrentLocation />
              {t('current_location')}
            </Button>
          </div>

          {dialogMap && (
            <ButtonGroup
              direction="column"
              className={clsx(
                'map-zoom-button-group',
                isMobile ? 'mobile' : ''
              )}
            >
              <IconButton
                appearance="secondary-action-button"
                className={clsx(
                  'map-zoom-button',
                  isMobile ? 'map-icon-button' : 'map-button'
                )}
                onClick={() => dialogMap.zoomIn()}
                label={t('map_zoom-in_button_label')}
                mobileView={isMobile}
              >
                <IconPlus />
              </IconButton>
              <IconButton
                appearance="secondary-action-button"
                className={clsx(
                  'map-zoom-button',
                  isMobile ? 'map-icon-button' : 'map-button'
                )}
                onClick={() => dialogMap.zoomOut()}
                label={t('map_zoom-out_button_label')}
                mobileView={isMobile}
              >
                <IconMinus />
              </IconButton>
            </ButtonGroup>
          )}
        </div>
      )}

      {isMobile && (
        <IncidentMapMobileSidebar
          selectedFeature={selectedFeature}
          selectedFeatureAddress={selectedFeatureAddress}
          categories={categories}
          selectedSubCategories={selectedSubCategories}
          setSelectedSubCategories={setSelectedSubCategories}
          resetSelectedIncident={resetSelectedIncident}
        />
      )}

      {isMobile && (
        <div className="flex items-center justify-center py-3 z-30 absolute bottom-0 w-full p-4 bg-base">
          <ButtonLink href="/" target="_blank" className="mobile full-width">
            {tIncidentMap('create_incident')}
            <Icon>
              <IconArrowRight />
            </Icon>
          </ButtonLink>
        </div>
      )}
    </div>
  )
}

export const FeatureCategoryIcon = (
  featureId: string | number | undefined,
  selectedFeatureId: number,
  featureIconUrl: string | null,
  config: AppConfig
) => {
  if (featureId === selectedFeatureId) {
    return (
      <Icon>
        {/* offset the selected feature marker by 30px to prevent shift in position and overlap with possible duplicates. */}
        <img
          className={!featureIconUrl ? 'mb-[30px]' : ''}
          src={
            config.base.assets_url +
            '/assets/images/feature-selected-marker.svg'
          }
        />
      </Icon>
    )
  }

  if (featureIconUrl) {
    return (
      <Icon className="!w-7 !h-7">
        <img src={featureIconUrl} alt="Categorie icoon" />
      </Icon>
    )
  }

  return <MapMarker />
}

export { IncidentMapContent }
