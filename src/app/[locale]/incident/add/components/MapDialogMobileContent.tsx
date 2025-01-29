import React, { useRef, useState } from 'react'
import { Marker } from 'react-map-gl/maplibre'
import { Map } from '@/components/ui/Map'
import { useTranslations } from 'next-intl'

import {
  Heading,
  Icon,
  IconButton,
  AlertDialog,
  Paragraph,
  Alert,
  Button,
  MapMarker,
  SpotlightSection,
} from '@/components'
import {
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize2,
  IconCurrentLocation,
  IconMinus,
  IconPlus,
  IconX,
} from '@tabler/icons-react'
import { ButtonGroup } from '@/components'

import { FeatureListItem } from '@/app/[locale]/incident/add/components/FeatureListItem'

import { AddressCombobox } from '@/components/ui/AddressCombobox'

import './MapDialog.css'

import useMapDialog from '@/hooks/useMapDialog'
import { MapDialogContentProps } from '@/app/[locale]/incident/add/components/MapDialogContent'
import * as Dialog from '@radix-ui/react-dialog'
import { useFormStore } from '@/store/form_store'
import clsx from 'clsx'

const MapDialogMobileContent = ({
  onMapReady,
  features,
  field,
  isAssetSelect = false,
}: MapDialogContentProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { formState } = useFormStore()

  const t = useTranslations('describe_add.map')

  const [fullscreenMap, setFullscreenMap] = useState(false)
  const [showList, setShowList] = useState<boolean>(false)

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
    setCurrentLocation,
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
      {/*min-h-[100vh] max-h-[100vh]*/}
      <div className="col-span-1 flex flex-col md:max-h-screen gap-4">
        <div className="flex flex-col overflow-y-auto gap-1 md:gap-4 py-3 px-2">
          <div className="flex justify-between items-center">
            <Heading level={1} className="!text-xl">
              {field?.meta.language.title
                ? field.meta.language.title
                : t('map_heading')}
            </Heading>
            <Dialog.Close asChild>
              <IconButton
                className="map-button !mr-0 !ml-auto"
                label={t('map_close_button_label')}
              >
                <IconX />
              </IconButton>
            </Dialog.Close>
          </div>

          {/*<MapExplainerAccordion />*/}

          <div
            className={clsx(
              'flex flex-col md:py-2',
              fullscreenMap ? 'hidden' : ''
            )}
          >
            <label htmlFor="address" className="!text-lg">
              {t('search_address_label')}
            </label>
            <AddressCombobox
              updatePosition={updatePosition}
              setIsMapSelected={setIsMapSelected}
              mobileView={true}
            />
          </div>
          {isAssetSelect && dialogMap && config && field ? (
            <div>
              {dialogMap.getZoom() < config.base.map.minimal_zoom && (
                <SpotlightSection type="info" className="!p-2">
                  <Paragraph className="!text-base">
                    {t('zoom_for_object', {
                      objects: objectDisplayName?.plural,
                    })}
                  </Paragraph>
                </SpotlightSection>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {/*min-h-[100vh] max-h-[50vh]*/}
      {showList && field && (
        <div className="px-3">
          <Heading level={3}>{assetSelectFeatureLabel}</Heading>
          {featureList.length > 0 && (
            <ul
              className="flex-1 overflow-y-auto my-3 max-h-[calc(100vh-17em)]"
              aria-labelledby="object-list-label"
            >
              {featureList.map((feature: any) => (
                <FeatureListItem
                  configUrl={config?.base.assets_url}
                  feature={feature}
                  key={feature.id}
                  field={field}
                  setError={setError}
                  dialogRef={dialogRef}
                  setFocusedItemId={setFocusedItemId}
                />
              ))}
            </ul>
          )}
          <div className="mb-0 mt-auto">
            <Button
              onClick={() => setShowList(false)}
              className="!text-lg !px-4 !py-3"
            >
              Kaart
            </Button>
          </div>
        </div>
      )}
      {config && (
        <div
          className={clsx(
            'col-span-1 md:col-span-2 md:max-h-screen relative',
            showList ? 'hidden' : ''
          )}
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
                const id = feature.id as number

                return (
                  <Marker
                    key={id}
                    // @ts-ignore
                    longitude={feature.geometry?.coordinates[0]}
                    // @ts-ignore
                    latitude={feature.geometry?.coordinates[1]}
                    // @ts-ignore
                    onClick={(e) => handleFeatureMarkerClick(e, feature)}
                  >
                    {!formState.selectedFeatures.some(
                      (featureItem) => featureItem.id === id
                    ) ? (
                      focusedItemId === id ? (
                        <Icon>
                          <div className="focused-map-marker"></div>
                        </Icon>
                      ) : (
                        <Icon>
                          <img src={field?.meta.featureTypes[0].icon.iconUrl} />
                        </Icon>
                      )
                    ) : (
                      <Icon>
                        <img
                          src={
                            config.base.assets_url +
                            '/assets/images/feature-selected-marker.svg'
                          }
                        />
                      </Icon>
                    )}
                  </Marker>
                )
              })}
          </Map>
          <div className="map-location-group">
            <Button
              onClick={() => setCurrentLocation()}
              className="!text-lg !px-4 !py-3"
            >
              <IconCurrentLocation />
              {t('current_location')}
            </Button>
          </div>

          <div className="map-fullscreen-group">
            <IconButton
              onClick={() => setFullscreenMap(!fullscreenMap)}
              label="fullscreen todo"
            >
              {fullscreenMap ? (
                <IconArrowsDiagonalMinimize2 />
              ) : (
                <IconArrowsDiagonal />
              )}
            </IconButton>
          </div>

          <div className="map-list-group">
            <Button
              onClick={() => setShowList(true)}
              className="!text-lg !px-4 !py-3"
            >
              Lijst
            </Button>
          </div>

          {dialogMap && (
            <ButtonGroup direction="column" className="map-zoom-button-group">
              <IconButton
                className="map-button !p-3"
                onClick={() => dialogMap.zoomIn()}
                label={t('map_zoom-in_button_label')}
              >
                <IconPlus />
              </IconButton>
              <IconButton
                className="map-button !p-3"
                onClick={() => dialogMap.zoomOut()}
                label={t('map_zoom-out_button_label')}
              >
                <IconMinus />
              </IconButton>
            </ButtonGroup>
          )}
        </div>
      )}

      <div
        className={clsx(
          'flex justify-center py-3 px-3',
          fullscreenMap ? 'hidden' : ''
        )}
      >
        <Dialog.Close asChild onClick={() => closeMapDialog()}>
          <Button
            appearance="primary-action-button"
            className="mobile !text-lg !w-max "
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
    </>
  )
}

export default MapDialogMobileContent
