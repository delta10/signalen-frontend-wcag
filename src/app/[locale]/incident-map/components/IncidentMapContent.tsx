'use client'

import React, { useMemo, useRef, useState } from 'react'
import { MapLayerMouseEvent, useMap, ViewState } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'

import '../../incident/add/components/MapDialog.css'
import {
  AlertDialog,
  Button,
  ButtonGroup,
  ButtonLink,
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
import { useIsClient, useMediaQuery, useWindowSize } from 'usehooks-ts'
import NestedCategoryCheckboxList from '@/app/[locale]/incident-map/components/NestedCategoryCheckboxList'
import { AddressCombobox } from '@/components/ui/AddressCombobox'
import { getNewSelectedAddress } from '@/lib/utils/address'
import SelectedIncidentDetails from '@/app/[locale]/incident-map/components/SelectedIncidentDetails'
import { Address } from '@/types/form'
import { clsx } from 'clsx'
import IncidentMapMobileSidebar from '@/app/[locale]/incident-map/components/IncidentMapMobileSidebar'
import { setCurrentLocation } from '@/lib/utils/LocationUtils'
import { getMapStyleUrl } from '@/lib/utils/map'
import { MapAttribution } from '@/components/ui/MapAttribution'
import { Paragraph } from '@utrecht/component-library-react/dist/css-module'
import { stepToPath } from '@/routing/navigation'
import { FormStep } from '@/types/form'
import { usePublicSignals, type PublicSignal } from '@/hooks/usePublicSignals'
import { PublicSignalMarkers } from '@/components/ui/PublicSignalMarkers'

const IncidentMapContent = () => {
  const t = useTranslations('describe_add.map')
  const tIncidentMap = useTranslations('incident_map')
  const { dialogMap } = useMap()
  const {
    signals: features,
    categories,
    loadError,
  } = usePublicSignals(dialogMap)
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  )
  const [selectedFeatureAddress, setSelectedFeatureAddress] =
    useState<Address | null>(null)
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  )
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [error, setError] = useState<string | null>(null)

  const config = useConfig()
  const { isDarkMode } = useDarkMode()
  const { width = 0 } = useWindowSize()
  const isMobile = useMediaQuery('only screen and (max-width : 768px)')
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

  const hasMounted = useIsClient()

  const mapContainerRef = useRef<HTMLDivElement>(null)

  const createIncidentHref = stepToPath[FormStep.STEP_1_DESCRIPTION]
  const createIncidentButton = (
    <ButtonLink
      purpose="primary"
      className="mobile full-width"
      iconEnd={<IconArrowRight />}
      href={createIncidentHref}
      target="_blank"
      rel="noopener noreferrer"
    >
      {tIncidentMap('create_incident')}
    </ButtonLink>
  )

  const filteredFeatures = useMemo(
    () =>
      selectedSubCategories.length === 0
        ? features
        : features.filter((feature) => {
            const slug = feature.properties.category.slug
            return slug ? selectedSubCategories.includes(slug) : false
          }),
    [features, selectedSubCategories]
  )

  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId || !features) {
      return
    }

    return features.find(
      (feature: PublicSignal) => feature.internal_id === selectedFeatureId
    )
  }, [selectedFeatureId, features])

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

  const handleFeatureMarkerClick = async (feature: PublicSignal) => {
    setSelectedFeatureId(feature.internal_id)
    setSelectedFeatureAddress(null)
    const [lng, lat] = feature.geometry.coordinates
    const address = await getNewSelectedAddress(lat, lng, config)
    setSelectedFeatureAddress(address)
  }

  const resetSelectedIncident = () => {
    setSelectedFeatureId(null)
    setSelectedFeatureAddress(null)
  }

  if (!hasMounted) {
    // Prevents rendering anything until on client, this causes hydration errors when opening the page on mobile screens.
    return null
  }

  return (
    <div className="grid h-full min-h-0 md:grid-cols-[max-content_1fr] overflow-y-hidden grid-rows-[auto_minmax(0,1fr)_auto] md:grid-rows-[minmax(0,1fr)]">
      <AlertDialog type="error" ref={dialogRef}>
        <form
          method="dialog"
          className="map-alert-dialog__content md:!min-w-[400px] md:!max-w-[400px]"
        >
          {error}
          <ButtonGroup>
            <Button
              purpose="secondary"
              hint="negative"
              onClick={() => dialogRef.current?.close()}
            >
              {t('close_alert_notification')}
            </Button>
          </ButtonGroup>
        </form>
      </AlertDialog>
      {!isMobile && (
        <div className="incident-map-sidebar col-span-1 flex flex-col min-h-0 shadow-right z-10 md:max-h-full md:max-w-[500px] overflow-y-auto">
          {selectedFeature ? (
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
          className="incident-map col-span-1 relative min-h-0 h-full"
          ref={mapContainerRef}
        >
          <Map
            {...viewState}
            id="dialogMap"
            onClick={(e) => handleMapClick(e)}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ blockSize: '100%', inlineSize: '100%' }}
            mapStyle={getMapStyleUrl(config, isDarkMode)}
            scrollZoom={!(width !== 0 && width < 768)}
            attributionControl={false}
            locale={{
              'AttributionControl.ToggleAttribution': t('toggle_attribution'),
            }}
            maxBounds={[
              ...config.base.map.maxBounds[0],
              ...config.base.map.maxBounds[1],
            ]}
          >
            <MapAttribution customAttribution={config.mapAttribution} />
            <PublicSignalMarkers
              signals={filteredFeatures}
              categories={categories}
              selectedSignalId={selectedFeatureId}
              onSelect={handleFeatureMarkerClick}
            />
            {loadError && (
              <div className="public-signals-status" role="status">
                {tIncidentMap('reports_unavailable')}
              </div>
            )}
          </Map>
          <div className="map-location-group">
            <Button
              purpose="secondary"
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
              iconStart={<IconCurrentLocation />}
            >
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
              <Button
                className={clsx(
                  'map-zoom-button',
                  isMobile ? 'map-icon-button' : 'map-button'
                )}
                onClick={() => dialogMap.zoomIn()}
                iconOnly
                iconStart={<IconPlus />}
                label={t('map_zoom-in_button_label')}
              />
              <Button
                className={clsx(
                  'map-zoom-button',
                  isMobile ? 'map-icon-button' : 'map-button'
                )}
                onClick={() => dialogMap.zoomOut()}
                iconOnly
                iconStart={<IconMinus />}
                label={t('map_zoom-out_button_label')}
              />
            </ButtonGroup>
          )}
        </div>
      )}

      {isMobile && (
        <div className="flex flex-col">
          <IncidentMapMobileSidebar
            selectedFeature={selectedFeature}
            selectedFeatureAddress={selectedFeatureAddress}
            categories={categories}
            selectedSubCategories={selectedSubCategories}
            setSelectedSubCategories={setSelectedSubCategories}
            resetSelectedIncident={resetSelectedIncident}
          />
          <div className="relative flex items-center justify-center py-3 z-30 w-full p-4 bg-white dark:bg-[#161615]">
            {createIncidentButton}
          </div>
        </div>
      )}
    </div>
  )
}

export { IncidentMapContent }
