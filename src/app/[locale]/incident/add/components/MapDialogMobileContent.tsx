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
  Button,
  MapMarker,
  SpotlightSection,
} from '@/components'
import {
  IconArrowsDiagonal,
  IconArrowsDiagonalMinimize2,
  IconChevronLeft,
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
import MapExplainerAccordion from '@/app/[locale]/incident/add/components/questions/MapExplainerAccordion'
import { setCurrentLocation } from '@/lib/utils/LocationUtils'
import { MapMarkerIcon } from '@/app/[locale]/incident/add/components/MapMarkerIcon'

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
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false)

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

  const toggleList = () => {
    setShowList(true)
    setFullscreenMap(false)
  }

  return (
    <>
      <AlertDialog type="error" ref={dialogRef}>
        <form method="dialog" className="map-alert-dialog__content">
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

      <div
        className={clsx(
          'flex flex-col  z-10',
          !showList ? 'shadow-bottom' : ''
        )}
      >
        <div className="flex flex-col overflow-y-auto gap-1 py-3 px-2">
          <div className="flex justify-between items-center">
            <Heading level={1} className="!text-xl">
              {field?.meta.language.title
                ? field.meta.language.title
                : t('map_heading')}
            </Heading>
            <Dialog.Close asChild>
              <IconButton
                mobileView={true}
                className="utrecht-button--subtle map-icon-button !mr-0 !ml-auto"
                label={t('map_close_button_label')}
              >
                <IconX />
              </IconButton>
            </Dialog.Close>
          </div>

          <div
            className={clsx(
              'flex flex-col mt-2',
              fullscreenMap ? 'hidden' : ''
            )}
          >
            <MapExplainerAccordion
              mobileView={true}
              isOpen={isAccordionOpen}
              setIsOpen={setIsAccordionOpen}
            />

            <label htmlFor="address" className="!text-lg mt-4">
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
                <SpotlightSection type="info" className="!p-2 !mt-2">
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

      {showList && field && (
        <div className="px-3">
          <Heading level={3}>{assetSelectFeatureLabel}</Heading>
          {featureList.length > 0 && (
            <ul
              className="flex-1 overflow-y-auto mt-3 min-h-60 max-h-[calc(100vh-19em)]"
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
        </div>
      )}
      {config && !isAccordionOpen && (
        <div
          className={clsx(
            'col-span-1 min-h-60 relative z-10',
            showList ? 'hidden' : 'shadow-top'
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
                const isSelected = formState.selectedFeatures.some(
                  (featureItem) => featureItem.id === id
                )
                const isFocused = focusedItemId === id
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
                    <MapMarkerIcon
                      isSelected={isSelected}
                      isFocused={isFocused}
                      iconUrl={feature.properties?.iconUrl}
                    />
                  </Marker>
                )
              })}
          </Map>
          <div className="map-location-group">
            {/*!text-lg !px-2 !py-2*/}
            <Button
              onClick={() =>
                setCurrentLocation(
                  config,
                  updatePosition,
                  setError,
                  dialogRef,
                  t
                )
              }
              className="utrecht-button--subtle map-icon-button mobile"
            >
              <IconCurrentLocation />
              {t('current_location')}
            </Button>
          </div>
          <div className="map-fullscreen-group">
            <IconButton
              onClick={() => setFullscreenMap(!fullscreenMap)}
              label={
                fullscreenMap
                  ? t('toggle_fullscreen_off')
                  : t('toggle_fullscreen_on')
              }
              mobileView={true}
              className="utrecht-button--subtle map-icon-button"
            >
              {fullscreenMap ? (
                <IconArrowsDiagonalMinimize2 />
              ) : (
                <IconArrowsDiagonal />
              )}
            </IconButton>
          </div>
          {isAssetSelect && (
            <div className="map-list-group">
              <Button
                onClick={() => toggleList()}
                className="utrecht-button--subtle map-icon-button mobile"
              >
                {t('show_list', { name: objectDisplayName.plural })}
              </Button>
            </div>
          )}
          {dialogMap && (
            <ButtonGroup direction="column" className="map-zoom-button-group">
              <IconButton
                mobileView={true}
                className="utrecht-button--subtle map-icon-button"
                onClick={() => dialogMap.zoomIn()}
                label={t('map_zoom-in_button_label')}
              >
                <IconPlus />
              </IconButton>
              <IconButton
                mobileView={true}
                className="utrecht-button--subtle map-icon-button"
                onClick={() => dialogMap.zoomOut()}
                label={t('map_zoom-out_button_label')}
              >
                <IconMinus />
              </IconButton>
            </ButtonGroup>
          )}
        </div>
      )}

      {!fullscreenMap && (
        <div className={clsx('flex flex-col my-2 px-3 self-end')}>
          {showList && (
            <Button
              onClick={() => setShowList(false)}
              className="mobile utrecht-button--subtle !pt-0 !pl-0 !justify-start !w-full !text-lg"
            >
              <IconChevronLeft />
              {t('back_to_map')}
            </Button>
          )}

          <Dialog.Close asChild onClick={() => closeMapDialog()}>
            <Button
              appearance="primary-action-button"
              className="mobile"
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
      )}
    </>
  )
}

export default MapDialogMobileContent
