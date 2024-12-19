import * as Dialog from '@radix-ui/react-dialog'
import React, {
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { debounce, uniqBy } from 'lodash'
import Map, {
  MapLayerMouseEvent,
  MapRef,
  Marker,
  MarkerEvent,
  useMap,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useFormStore } from '@/store/form_store'
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
import { useConfig } from '@/hooks/useConfig'
import {
  IconChevronDown,
  IconCurrentLocation,
  IconMinus,
  IconPlus,
  IconX,
} from '@tabler/icons-react'
import { ButtonGroup } from '@/components'
import {
  formatAddressToSignalenInput,
  getFeatureDescription,
  getFeatureId,
  getFeatureType,
  isCoordinateInsideMaxBound,
} from '@/lib/utils/map'
import { getNearestAddressByCoordinate } from '@/services/location/address'
import { Feature, FeatureCollection } from 'geojson'
import { PublicQuestion } from '@/types/form'
import { FeatureListItem } from '@/app/[locale]/incident/add/components/FeatureListItem'
import { useDarkMode } from '@/hooks/useDarkMode'
import { useFormContext } from 'react-hook-form'
import { AddressCombobox } from '@/components/ui/AddressCombobox'
import {
  getFirstFeatureOrCurrentAddress,
  getNewSelectedAddress,
} from '@/lib/utils/address'
import MapExplainerAccordion from './questions/MapExplainerAccordion'
import { useWindowSize } from 'usehooks-ts'

type MapDialogProps = {
  trigger: React.ReactElement
  onMapReady?: (map: MapRef) => void
  features?: FeatureCollection | null
  field?: PublicQuestion
  isAssetSelect?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({
  trigger,
  onMapReady,
  features,
  field,
  isAssetSelect = false,
}: MapDialogProps) => {
  const t = useTranslations('describe_add.map')
  const [marker, setMarker] = useState<[number, number] | []>([])
  const [error, setError] = useState<string | null>(null)
  const [focusedItemId, setFocusedItemId] = useState<number | null>(null)
  const { formState, updateForm } = useFormStore()
  const { dialogMap } = useMap()
  const { loading, config } = useConfig()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isMapSelected, setIsMapSelected] = useState<boolean | null>(null)
  const [mapFeatures, setMapFeatures] = useState<FeatureCollection | null>()
  const { setValue } = useFormContext()
  const { isDarkMode } = useDarkMode()
  const { width = 0 } = useWindowSize()

  const [viewState, setViewState] = useState<ViewState>({
    latitude: 0,
    longitude: 0,
    zoom: 15,
    bearing: 0,
    padding: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    pitch: 0,
  })

  // Set viewState coordinates to configured ones
  useEffect(() => {
    if (!loading && config) {
      setViewState({
        ...viewState,
        latitude:
          formState.coordinates[0] === 0
            ? config.base.map.center[0]
            : formState.coordinates[0],
        longitude:
          formState.coordinates[1] === 0
            ? config.base.map.center[1]
            : formState.coordinates[1],
      })
    }
  }, [loading, config, formState.coordinates])

  // Change marker position on formState.coordinates change
  useEffect(() => {
    setMarker([formState.coordinates[0], formState.coordinates[1]])
  }, [formState.coordinates])

  // Set dialog map in parent component
  useEffect(() => {
    if (dialogMap && onMapReady) {
      onMapReady(dialogMap)
    }
  }, [dialogMap, onMapReady])

  // Set new map features with ID
  useEffect(() => {
    if (features && field) {
      const featuresWithId = features.features.map((feature) => {
        const featureType = getFeatureType(
          field.meta.featureTypes,
          feature.properties
        )

        return {
          ...feature,
          // @ts-ignore
          id: getFeatureId(featureType, feature.properties),
          description: getFeatureDescription(featureType, feature.properties),
        }
      })

      setMapFeatures({ ...features, features: featuresWithId })
    }
  }, [features])

  // memoize list of features to show in left sidebar
  const featureList = useMemo(() => {
    if (config && dialogMap) {
      const mapFeaturesToShow = mapFeatures ? mapFeatures.features : []

      const features =
        dialogMap?.getZoom() > config.base.map.minimal_zoom
          ? mapFeaturesToShow
          : []

      return uniqBy([...features, ...formState.selectedFeatures], 'id')
    }

    return []
  }, [formState.selectedFeatures, mapFeatures?.features, dialogMap?.getZoom()])

  // Update position, flyTo position, after this set the marker position
  const updatePosition = (lat: number, lng: number) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [lng, lat],
        zoom: 18,
      })
    }

    setMarker([lat, lng])
  }

  // Handle click on map, setIsMapSelected to true
  const handleMapClick = async (event: MapLayerMouseEvent) => {
    updatePosition(event.lngLat.lat, event.lngLat.lng)
    setIsMapSelected(true)
    const address = await getNewSelectedAddress(
      event.lngLat.lat,
      event.lngLat.lng,
      config
    )

    updateForm({
      ...formState,
      address: address,
    })
  }

  const keyDownHandler = async (event: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const coordinates = dialogMap?.getCenter()
      if (coordinates) {
        updatePosition(coordinates.lat, coordinates.lng)
        setIsMapSelected(true)
        const address = await getNewSelectedAddress(
          coordinates.lat,
          coordinates.lng,
          config
        )

        updateForm({
          ...formState,
          address: address,
        })
      }
    }
  }

  // Handle click on feature marker, set selectedFeatures and show error if maxNumberOfAssets is reached
  const handleFeatureMarkerClick = async (
    event: MarkerEvent,
    feature: Feature
  ) => {
    // @ts-ignore
    event.originalEvent?.stopPropagation()
    // @ts-ignore
    const featureId = feature.id as number
    const maxNumberOfAssets = field?.meta.maxNumberOfAssets || 1

    if (dialogMap && featureId) {
      const newSelectedFeatureArray = Array.from(
        formState.selectedFeatures ? formState.selectedFeatures : []
      )

      const index = newSelectedFeatureArray.findIndex(
        (feature) => feature.id === featureId
      )

      if (index !== -1) {
        newSelectedFeatureArray.splice(index, 1) // Remove the feature at the found index
      } else {
        if (newSelectedFeatureArray.length >= maxNumberOfAssets) {
          setError(t('max_number_of_assets_error', { max: maxNumberOfAssets }))
          dialogRef.current?.showModal()

          return
        }

        newSelectedFeatureArray.push(feature)
      }

      const address = await getFirstFeatureOrCurrentAddress(
        // @ts-ignore
        feature.geometry.coordinates[1],
        // @ts-ignore
        feature.geometry.coordinates[0],
        newSelectedFeatureArray,
        config,
        formState
      )

      updateForm({
        ...formState,
        selectedFeatures: newSelectedFeatureArray,
        address: address,
      })

      setIsMapSelected(false)
      setMarker([
        // @ts-ignore
        feature.geometry.coordinates[1],
        // @ts-ignore
        feature.geometry.coordinates[0],
      ])
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
        dialogRef.current?.showModal()
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
        dialogRef.current?.showModal()
      }
    )
  }

  // Close map dialog, if isAssetSelect is not set only update formStore with new coordinates. Otherwise update field with type isAssetSelect with feature answers
  const closeMapDialog = async () => {
    updateForm({ ...formState, coordinates: marker })
    if (isAssetSelect && field) {
      const formValues = await Promise.all(
        formState.selectedFeatures.map(async (feature) => {
          const address = await getNearestAddressByCoordinate(
            // @ts-ignore
            feature.geometry.coordinates[1],
            // @ts-ignore
            feature.geometry.coordinates[0],
            config ? config.base.map.find_address_in_distance : 30
          )
          return {
            address: {
              ...formatAddressToSignalenInput(
                address ? address.weergavenaam : ''
              ),
            },
            id: feature.id?.toString(),
            coordinates: {
              // @ts-ignore
              lat: feature.geometry.coordinates[1],
              // @ts-ignore
              lng: feature.geometry.coordinates[0],
            },
            // @ts-ignore
            description: feature.description,
            // @ts-ignore
            label: feature.description,
            type: 'Feature',
          }
        })
      )
      setValue(field.key, formValues)
    }
  }

  const mapStyle = isDarkMode
    ? `${process.env.NEXT_PUBLIC_MAPTILER_MAP_DARK_MODE}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`
    : `${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`

  useEffect(() => {
    const element = document.getElementsByClassName('maplibregl-canvas')
    const canvas = element[1]
    const debouncedHandler = debounce(keyDownHandler, 500)

    // Create a reference to the wrapped handler function
    const eventHandler = (e: KeyboardEvent) => debouncedHandler(e)

    // @ts-ignore
    canvas?.addEventListener('keydown', eventHandler)

    // Cleanup using the same function reference
    return () => {
      // @ts-ignore
      canvas?.removeEventListener('keydown', eventHandler)
    }
  }, [dialogMap, onMapReady])

  const assetSelectFeatureLabel =
    isAssetSelect && field ? field.meta.language.title || field.meta.label : ''

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="grid md:grid-cols-3 overflow-scroll signalen-modal-dialog signalen-modal-dialog--cover-viewport">
          <VisuallyHidden.Root>
            <Dialog.Title>
              {field?.meta.language.title
                ? field.meta.language.title
                : t('dialog_title')}
            </Dialog.Title>
            <Dialog.Description>{t('dialog_description')}</Dialog.Description>
          </VisuallyHidden.Root>
          <AlertDialog
            type="error"
            ref={dialogRef}
            style={{
              margin: '128px auto 0',
              maxWidth: 'calc(100% - 32px)',
            }}
          >
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
          <div className="col-span-1 flex flex-col min-h-[100vh] max-h-[100vh] md:max-h-screen gap-4">
            <div className="flex flex-col overflow-scroll md:overflow-hidden gap-4 p-4">
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

              <div className="block md:hidden">
                <Alert>
                  <div className="flex flex-row items-center">
                    <Paragraph>{t('scroll_for_map')}</Paragraph>
                    <IconButton
                      appearance="secondary-action-button"
                      label={t('scroll_to_map_button')}
                      onClick={() =>
                        mapContainerRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                      }
                      className="ml-2"
                    >
                      <Icon>
                        <IconChevronDown />
                      </Icon>
                    </IconButton>
                  </div>
                </Alert>
              </div>
              {isAssetSelect && dialogMap && config && field ? (
                <div className="flex flex-col overflow-scroll md:overflow-hidden gap-4 pt-2">
                  {dialogMap.getZoom() < config.base.map.minimal_zoom && (
                    <SpotlightSection type="info">
                      <Paragraph>{t('zoom_for_object')}</Paragraph>
                    </SpotlightSection>
                  )}
                  {featureList.length > 0 && (
                    <Heading level={3}>{assetSelectFeatureLabel}</Heading>
                  )}
                  {featureList.length > 0 && (
                    <ul
                      className="flex-1 overflow-y-auto mb-2"
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
              ) : null}
            </div>
            <Dialog.Close asChild onClick={() => closeMapDialog()}>
              <Button appearance="primary-action-button" className="ml-4">
                {isAssetSelect
                  ? formState.selectedFeatures.length === 0
                    ? t('go_further_without_selected_object')
                    : formState.selectedFeatures.length === 1
                      ? field?.meta.language.submit ||
                        t('go_further_without_selected_object')
                      : field?.meta.language.submitPlural ||
                        field?.meta.language.submit ||
                        t('go_further_without_selected_object')
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
                  config.base.map.maxBounds as [
                    [number, number],
                    [number, number],
                  ]
                }
              >
                {marker.length && (isMapSelected === null || isMapSelected) && (
                  <Marker latitude={marker[0]} longitude={marker[1]}>
                    <MapMarker />
                  </Marker>
                )}
                {onMapReady &&
                  dialogMap &&
                  dialogMap.getZoom() > config.base.map.minimal_zoom &&
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
                              <img
                                src={field?.meta.featureTypes[0].icon.iconUrl}
                              />
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
                <Button onClick={() => setCurrentLocation()}>
                  <IconCurrentLocation />
                  {t('current_location')}
                </Button>
              </div>

              <Dialog.Close asChild>
                <IconButton
                  className="map-button map-close-button"
                  label={t('map_close_button_label')}
                >
                  <IconX />
                </IconButton>
              </Dialog.Close>

              <ButtonGroup direction="column" className="map-zoom-button-group">
                <IconButton
                  className="map-button map-zoom-button"
                  onClick={() => dialogMap?.flyTo({ zoom: viewState.zoom + 1 })}
                  label={t('map_zoom-in_button_label')}
                >
                  <IconPlus />
                </IconButton>
                <IconButton
                  className="map-button map-zoom-button"
                  onClick={() => dialogMap?.flyTo({ zoom: viewState.zoom - 1 })}
                  label={t('map_zoom-out_button_label')}
                >
                  <IconMinus />
                </IconButton>
              </ButtonGroup>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { MapDialog }
