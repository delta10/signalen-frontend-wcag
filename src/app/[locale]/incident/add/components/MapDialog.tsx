import * as Dialog from '@radix-ui/react-dialog'
import React, { useEffect, useRef, useState } from 'react'
import Map, {
  MapLayerMouseEvent,
  Marker,
  useMap,
  ViewState,
} from 'react-map-gl/maplibre'
import { useTranslations } from 'next-intl'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useFormStore } from '@/store/form_store'
import {
  Heading,
  Icon,
  AlertDialog,
  Paragraph,
  Button,
  FormField,
  ListboxOptionProps,
  // SelectCombobox,
} from '@/components'
import { useConfig } from '@/hooks/useConfig'
import {
  IconCurrentLocation,
  IconMapPinFilled,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react'
import { ButtonGroup } from '@/components'
import { isCoordinateInsideMaxBound } from '@/lib/utils/map'
import { getSuggestedAddresses } from '@/services/location/address'
import { getServerConfig } from '@/services/config/config'

type MapDialogProps = {
  trigger: React.ReactElement
} & React.HTMLAttributes<HTMLDivElement>

const MapDialog = ({ trigger }: MapDialogProps) => {
  const t = useTranslations('describe-add.map')
  const [marker, setMarker] = useState<[number, number] | []>([])
  const [outsideMaxBoundError, setOutsideMaxBoundError] = useState<
    string | null
  >(null)
  const [addressOptions, setAddressOptions] = useState<ListboxOptionProps[]>([])
  const { formState, updateForm } = useFormStore()
  const { dialogMap } = useMap()
  const { loading, config } = useConfig()
  const dialogRef = useRef<HTMLDialogElement>(null)

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

  // Update position, flyTo position, after this set the marker position
  const updatePosition = (lat: number, lng: number) => {
    if (dialogMap) {
      dialogMap.flyTo({
        center: [lng, lat],
        speed: 0.5,
        zoom: 18,
      })
    }

    setMarker([lat, lng])
  }

  // Handle click on map
  const handleMapClick = (event: MapLayerMouseEvent) => {
    updatePosition(event.lngLat.lat, event.lngLat.lng)
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
          setOutsideMaxBoundError(null)
          return
        }

        setOutsideMaxBoundError(t('outside_max_bound_error'))
        dialogRef.current?.showModal()
      },
      (locationError) => {
        setOutsideMaxBoundError(locationError.message)
        dialogRef.current?.showModal()
      }
    )
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="fixed inset-0 bg-white z-[1000] grid grid-cols-1 md:grid-cols-3 utrecht-theme">
          <VisuallyHidden.Root>
            {/* TODO: Overleggen welke titel hier het meest vriendelijk is voor de gebruiker, multi-language support integreren */}
            <Dialog.Title>{t('dialog_title')}</Dialog.Title>
            <Dialog.Description>{t('dialog_description')}</Dialog.Description>
          </VisuallyHidden.Root>
          <AlertDialog type="error" ref={dialogRef} style={{ marginTop: 128 }}>
            <form method="dialog" className="map-alert-dialog__content">
              <Paragraph>{outsideMaxBoundError}</Paragraph>
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
          <div className="col-span-1 p-4 flex flex-col justify-between gap-4">
            <div>
              <Heading level={1}>{t('map_heading')}</Heading>
              {/*<FormField*/}
              {/*  label={t('address_search_label')}*/}
              {/*  input={*/}
              {/*    <SelectCombobox*/}
              {/*      name="address"*/}
              {/*      options={addressOptions}*/}
              {/*      type="search"*/}
              {/*      onChange={async (evt: any) => {*/}
              {/*        const municipality = (await getServerConfig())['base'][*/}
              {/*          'municipality'*/}
              {/*        ]*/}
              {/*        const apiCall = await getSuggestedAddresses(*/}
              {/*          evt.target.value,*/}
              {/*          municipality*/}
              {/*        )*/}

              {/*        // TODO: Prevent out-of-order responses showing up*/}
              {/*        setAddressOptions([])*/}
              {/*        setAddressOptions(*/}
              {/*          apiCall.response.docs.map((item) => ({*/}
              {/*            children: item.weergavenaam,*/}
              {/*            value: item.weergavenaam,*/}
              {/*          }))*/}
              {/*        )*/}
              {/*      }}*/}
              {/*    />*/}
              {/*  }*/}
              {/*></FormField>*/}
            </div>
            <div>
              <Dialog.Close
                asChild
                onClick={() =>
                  updateForm({ ...formState, coordinates: marker })
                }
              >
                <Button appearance="primary-action-button">
                  {t('choose_location')}
                </Button>
              </Dialog.Close>
            </div>
          </div>
          {config && (
            <div className="col-span-1 md:col-span-2 relative">
              <Map
                {...viewState}
                id="dialogMap"
                onClick={(e) => handleMapClick(e)}
                onMove={(evt) => setViewState(evt.viewState)}
                style={{ blockSize: '100%', inlineSize: '100%' }}
                mapStyle={`${process.env.NEXT_PUBLIC_MAPTILER_MAP}/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
                attributionControl={false}
                maxBounds={config.base.map.maxBounds}
              >
                {marker.length && (
                  <Marker latitude={marker[0]} longitude={marker[1]}>
                    <Icon className="map-marker-icon">
                      <IconMapPinFilled
                        className="-translate-y-1/2"
                        color={config.base.style.primaryColor}
                      />
                    </Icon>
                  </Marker>
                )}
              </Map>
              <div className="map-location-group">
                <Button onClick={() => setCurrentLocation()}>
                  <IconCurrentLocation />
                  {t('current_location')}
                </Button>
              </div>
              <ButtonGroup direction="column" className="map-zoom-button-group">
                <Button
                  className="map-zoom-button"
                  onClick={() => dialogMap?.flyTo({ zoom: viewState.zoom + 1 })}
                >
                  <IconPlus />
                </Button>
                <Button
                  className="map-zoom-button"
                  onClick={() => dialogMap?.flyTo({ zoom: viewState.zoom - 1 })}
                >
                  <IconMinus />
                </Button>
              </ButtonGroup>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { MapDialog }
