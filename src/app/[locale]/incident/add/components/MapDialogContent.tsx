import React, { useEffect, useRef } from 'react'
import {
  AlertDialog,
  Button,
  ButtonGroup,
  Heading,
  IconButton,
  MapMarker,
  Paragraph,
  SpotlightSection,
} from '@/components'
import MapExplainerAccordion from '@/app/[locale]/incident/add/components/questions/MapExplainerAccordion'
import { AddressCombobox } from '@/components/ui/AddressCombobox'
import {
  IconCurrentLocation,
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconX,
} from '@tabler/icons-react'
import { FeatureListItem } from '@/app/[locale]/incident/add/components/FeatureListItem'
import * as Dialog from '@radix-ui/react-dialog'
import { Map } from '@/components/ui/Map'
import { MapRef, Marker } from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import useMapDialog from '@/hooks/useMapDialog'
import { useFormStore } from '@/store/form_store'
import { FeatureCollection } from 'geojson'
import { PublicQuestion } from '@/types/form'
import { setCurrentLocation } from '@/lib/utils/LocationUtils'
import { FeatureTypeIcon } from '@/app/[locale]/incident/add/components/FeatureTypeIcon'
import { ExtendedFeature } from '@/types/map'
import FeatureTypeLegend from '@/app/[locale]/incident/add/components/FeatureTypeLegend'
import { Layer, Source } from 'react-map-gl/maplibre'

export type MapDialogContentProps = {
  onMapReady?: (map: MapRef) => void
  field?: PublicQuestion
  features?: FeatureCollection | null
  isAssetSelect?: boolean
  loadingAssets?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const MapDialogContent = ({
  onMapReady,
  field,
  features,
  isAssetSelect = false,
}: MapDialogContentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { formState } = useFormStore()

  const t = useTranslations('describe_add.map')

  const {
    dialogMap,
    dialogRef,
    config,
    viewState,
    setViewState,
    marker,
    updatePosition,
    isMapSelected,
    setIsMapSelected,
    objectDisplayName,
    featureList,
    assetSelectFeatureLabel,
    focusedItemId,
    setFocusedItemId,
    closeMapDialog,
    handleMapClick,
    mapStyle,
    width,
    mapFeatures,
    error,
    setError,
    handleFeatureMarkerClick,
    openLegend,
    setOpenLegend,
  } = useMapDialog(onMapReady, field, features, isAssetSelect)

  const restrictedTilesetTileJson =
    'https://api.maptiler.com/tiles/019b9355-8938-7950-80a4-96585637f25e/tiles.json?key=K3FQAjXPERToZYyHKNPG'
  const maskTilesetTileJson =
    'https://api.maptiler.com/tiles/019beaf4-7ca8-7656-b1fb-a218f3c79078/tiles.json?key=PQAbxfeC4o0w2XNjczf0'

  // IMPORTANT: you must set this to the *actual* source-layer name inside the tileset voor de huidige is dat nu test blijkbaar
  const RESTRICTED_SOURCE_LAYER = 'test'

  // Source ids
  const RESTRICTED_SOURCE_ID = 'restricted-areas'
  const MASK_SOURCE_ID = 'mask-areas'

  // Layer ids (moeten uniek zijn!)
  const RESTRICTED_FILL_ID = 'restricted-corridor-fill'
  const RESTRICTED_OUTLINE_ID = 'restricted-corridor-outline'
  const RESTRICTED_LINE_ID = 'restricted-corridor-line' // optional
  const MASK_FILL_ID = 'outside-mask-fill'

  // Corridor fill (dit laat het corridor-vlak zien)
  const restrictedCorridorFillLayer: any = {
    id: RESTRICTED_FILL_ID,
    type: 'fill',
    source: RESTRICTED_SOURCE_ID,
    'source-layer': RESTRICTED_SOURCE_LAYER,
    paint: {
      'fill-opacity': 0.25,
      // kies eventueel een kleur die je goed ziet:
      // 'fill-color': '#00ff00',
    },
  }

  // Corridor outline (rand van corridor)
  const restrictedCorridorOutlineLayer: any = {
    id: RESTRICTED_OUTLINE_ID,
    type: 'line',
    source: RESTRICTED_SOURCE_ID,
    'source-layer': RESTRICTED_SOURCE_LAYER,
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 2],
      'line-opacity': 1,
    },
  }

  // Optional: extra line layer (vaak niet nodig, maar kan)
  const restrictedCorridorLineLayer: any = {
    id: RESTRICTED_LINE_ID,
    type: 'line',
    source: RESTRICTED_SOURCE_ID,
    'source-layer': RESTRICTED_SOURCE_LAYER,
    layout: { 'line-join': 'round', 'line-cap': 'round' },
    paint: {
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.5, 16, 3],
      'line-opacity': 0.9,
    },
  }

  // Mask fill (alles buiten corridor)
  const maskCorridorFillLayer: any = {
    id: MASK_FILL_ID,
    type: 'fill',
    source: MASK_SOURCE_ID,
    'source-layer': 'output',
    paint: {
      'fill-color': '#858383',
      'fill-opacity': 0.6,
    },
  }

  return (
    <>
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
      <FeatureTypeLegend
        featureTypes={field?.meta.featureTypes}
        openLegend={openLegend}
        setOpenLegend={setOpenLegend}
      />
      <div className="col-span-1 flex flex-col min-h-[100vh] max-h-[100vh] md:max-h-screen gap-4 shadow-right z-10">
        <div className="flex flex-col overflow-y-auto gap-4 px-4 pt-4">
          <Heading level={1}>
            {field?.meta.language.title
              ? field.meta.language.title
              : t('map_heading')}
          </Heading>

          <MapExplainerAccordion />

          <div className="flex flex-col py-2">
            <label htmlFor="address-combobox">
              {t('search_address_label')}
            </label>
            <AddressCombobox
              updatePosition={updatePosition}
              setIsMapSelected={setIsMapSelected}
              id="address-combobox"
            />
          </div>

          {isAssetSelect && dialogMap && config && field ? (
            <div className="flex flex-col gap-4 pt-2 flex-grow">
              {dialogMap.getZoom() < config.base.map.minimal_zoom && (
                <SpotlightSection type="info">
                  <Paragraph>
                    {t('zoom_for_object', {
                      objects: objectDisplayName?.plural,
                    })}
                  </Paragraph>
                </SpotlightSection>
              )}
              {featureList.length > 0 && (
                <>
                  <Heading level={3}>{assetSelectFeatureLabel}</Heading>
                  <ul
                    className="flex-1 overflow-y-auto mb-2 max-h-[calc(100vh-22em)]"
                    aria-labelledby="object-list-label"
                  >
                    {featureList.map((feature: any) => (
                      <FeatureListItem
                        configUrl={config?.base.assets_url}
                        feature={feature}
                        key={feature.internal_id}
                        field={field}
                        setError={setError}
                        dialogRef={dialogRef}
                        setFocusedItemId={setFocusedItemId}
                      />
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : null}
        </div>
        <Dialog.Close
          className="flex items-end"
          asChild
          onClick={() => closeMapDialog()}
        >
          <Button
            appearance="primary-action-button"
            className="ml-4 mr-4 mb-4"
            type="button"
          >
            {isAssetSelect
              ? formState.selectedFeatures.length === 0
                ? formState.address
                  ? t('choose_this_location_no_asset_but_address', {
                      object: objectDisplayName.singular,
                    })
                  : t('go_further_without_selected_object', {
                      object: objectDisplayName.singular,
                    })
                : formState.selectedFeatures.length === 1
                  ? field?.meta.language.submit ||
                    t('go_further_without_selected_object', {
                      object: objectDisplayName.singular,
                    })
                  : field?.meta.language.submitPlural ||
                    field?.meta.language.submit ||
                    t('go_further_without_selected_object', {
                      object: objectDisplayName.singular,
                    })
              : t('choose_this_location')}
          </Button>
        </Dialog.Close>
      </div>
      {config && (
        <div
          className="col-span-1 md:col-span-2 min-h-[100vh] max-h-[50vh] md:max-h-screen relative"
          ref={mapContainerRef}
        >
          <Map
            {...viewState}
            id="dialogMap"
            onClick={(e) => handleMapClick(e)}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ blockSize: '100%', inlineSize: '100%' }}
            mapStyle={mapStyle}
            scrollZoom={!(width !== 0 && width < 768)}
            attributionControl={false}
            maxBounds={
              config.base.map.maxBounds as [[number, number], [number, number]]
            }
            interactiveLayerIds={[RESTRICTED_FILL_ID]} // ONLY this layer is clickable
          >
            {/* Address or selected point on map marker */}
            {marker.length && (isMapSelected === null || isMapSelected) && (
              <Marker latitude={marker[0]} longitude={marker[1]}>
                <MapMarker />
              </Marker>
            )}
            {/* Show available features assets on the map */}
            {onMapReady &&
              dialogMap &&
              dialogMap.getZoom() >= config.base.map.minimal_zoom &&
              mapFeatures?.features.map((feature) => {
                const extendedFeature = feature as ExtendedFeature
                const id = extendedFeature.internal_id
                const isSelected = formState.selectedFeatures.some(
                  (featureItem) => featureItem.internal_id === id
                )
                const isFocused = focusedItemId === id
                return (
                  <Marker
                    key={id}
                    // @ts-ignore
                    longitude={feature.geometry?.coordinates[0]}
                    // @ts-ignore
                    latitude={feature.geometry?.coordinates[1]}
                    onClick={(e) =>
                      // @ts-ignore
                      handleFeatureMarkerClick(e, extendedFeature)
                    }
                  >
                    <FeatureTypeIcon
                      isSelected={isSelected}
                      isFocused={isFocused}
                      iconUrl={feature.properties?.iconUrl}
                    />
                  </Marker>
                )
              })}
            <Source
              id={RESTRICTED_SOURCE_ID}
              type="vector"
              url={restrictedTilesetTileJson}
            >
              <Layer {...restrictedCorridorOutlineLayer} />
              {/* optional: <Layer {...restrictedCorridorLineLayer} /> */}
            </Source>

            <Source id={MASK_SOURCE_ID} type="vector" url={maskTilesetTileJson}>
              <Layer {...maskCorridorFillLayer} />
            </Source>
          </Map>
          <div className="map-location-group">
            <Button
              appearance="secondary-action-button"
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

          <Dialog.Close asChild>
            <IconButton
              appearance="secondary-action-button"
              className="map-button map-close-button"
              label={t('map_close_button_label')}
            >
              <IconX />
            </IconButton>
          </Dialog.Close>

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

          <div className="map-legend-group">
            <Button
              appearance="secondary-action-button"
              onClick={() => {
                setOpenLegend(!openLegend)
              }}
            >
              <IconInfoCircle />
              {t('legend')}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default MapDialogContent
