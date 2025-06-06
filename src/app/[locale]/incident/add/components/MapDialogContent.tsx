import React, { useRef } from 'react'
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
  } = useMapDialog(onMapReady, field, features, isAssetSelect)

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
      <div className="col-span-1 flex flex-col min-h-[100vh] max-h-[100vh] md:max-h-screen gap-4 shadow-right z-10">
        <div className="flex flex-col overflow-y-auto gap-4 px-4 pt-4">
          <Heading level={1}>
            {field?.meta.language.title
              ? field.meta.language.title
              : t('map_heading')}
          </Heading>

          <MapExplainerAccordion />

          <div className="flex flex-col py-2">
            <label htmlFor="address">{t('search_address_label')}</label>
            <AddressCombobox
              updatePosition={updatePosition}
              setIsMapSelected={setIsMapSelected}
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
                const id = extendedFeature.internal_id as number
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
        </div>
      )}
    </>
  )
}

export default MapDialogContent
