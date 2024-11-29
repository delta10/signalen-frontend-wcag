import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider, MapRef, useMap } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  LinkButton,
  Fieldset,
  FieldsetLegend,
} from '@/components/index'
import { useFormStore } from '@/store/form_store'
import { getNearestAddressByCoordinate } from '@/services/location/address'
import { useConfig } from '@/hooks/useConfig'
import { formatAddressToSignalenInput, isCoordinates } from '@/lib/utils/map'
import { useTranslations } from 'next-intl'
import { FormFieldErrorMessage } from '@/components'
import { getGeoJsonFeatures } from '@/services/location/features'
import { FeatureCollection } from 'geojson'

export interface AssetSelectProps {
  field?: PublicQuestion
}

export const AssetSelect = ({ field }: AssetSelectProps) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors['location']?.message as string
  const { formState: formStoreState, updateForm } = useFormStore()
  const [address, setAddress] = useState<string | null>(null)
  const { config } = useConfig()
  const t = useTranslations('describe_add.map')
  const tGeneral = useTranslations('general')
  const [dialogMap, setDialogMap] = useState<MapRef | null>(null)
  const [features, setFeatures] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    const getAddress = async () => {
      const result = await getNearestAddressByCoordinate(
        formStoreState.coordinates[0],
        formStoreState.coordinates[1],
        config ? config.base.map.find_address_in_distance : 30
      )

      if (result) {
        setAddress(result.weergavenaam)
        updateForm({
          ...formStoreState,
          address: {
            postcode: result.postcode,
            huisnummer: result.huis_nlt,
            woonplaats: result.woonplaatsnaam,
            openbare_ruimte: result.straatnaam,
            weergave_naam: result.weergavenaam,
          },
        })
      } else {
        setAddress(null)
      }
    }

    getAddress()
  }, [formStoreState.coordinates])

  const onMapReady = (map: MapRef) => {
    setDialogMap(map)
  }

  // Set new features on map move or zoom
  useEffect(() => {
    const setNewFeatures = async () => {
      const bounds = dialogMap?.getBounds()
      const zoom = dialogMap?.getZoom()

      if (
        field &&
        bounds &&
        field.meta &&
        field.meta.endpoint &&
        zoom &&
        config &&
        zoom > config.base.map.minimal_zoom
      ) {
        const endpoint = field.meta.endpoint
          .replaceAll('{srsName}', 'EPSG:4326')
          .replace('{west}', bounds.getWest())
          .replace('{north}', bounds.getNorth())
          .replace('{south}', bounds.getSouth())
          .replace('{east}', bounds.getEast())

        const geojson = await getGeoJsonFeatures(endpoint)

        setFeatures(geojson)
      }
    }

    if (dialogMap) {
      dialogMap.on('moveend', setNewFeatures)
    }

    return () => {
      if (dialogMap) {
        dialogMap.off('moveend', setNewFeatures)
      }
    }
  }, [dialogMap])

  // If formStoreState.selectedFeatures changes, populate form with selected assets
  useEffect(() => {
    const populateFormValueWithAssets = async () => {
      if (field) {
        const formValues = await Promise.all(
          formStoreState.selectedFeatures.map(async (feature) => {
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

    populateFormValueWithAssets()
  }, [formStoreState.selectedFeatures])

  return (
    <Fieldset invalid={Boolean(errorMessage)} className="w-full">
      <FieldsetLegend>
        {field
          ? `${field.meta.label} (${tGeneral('form.required_short')})`
          : `${t('map_label')} (${tGeneral('form.required_short')})`}
      </FieldsetLegend>

      {Boolean(errorMessage) && errorMessage && (
        <FormFieldErrorMessage>{errorMessage}</FormFieldErrorMessage>
      )}

      <div className="relative w-full">
        <div style={{ minHeight: 200, height: 200 }}>
          <LocationMap />
        </div>
        <Paragraph>{address}</Paragraph>
        {formStoreState.selectedFeatures.map((feature: any) => (
          <Paragraph key={feature.id}>{feature.description}</Paragraph>
        ))}
        <MapProvider>
          <MapDialog
            onMapReady={onMapReady}
            features={features}
            field={field}
            isAssetSelect
            trigger={
              isCoordinates(formStoreState.coordinates) &&
              formStoreState.coordinates[0] === 0 &&
              formStoreState.coordinates[1] === 0 ? (
                <Button
                  appearance="primary-action-button"
                  id="location-button"
                  className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                  type="button"
                >
                  Kies locatie
                </Button>
              ) : (
                <LinkButton inline={true} id="location-button" type="button">
                  Wijzig locatie
                </LinkButton>
              )
            }
          />
        </MapProvider>
      </div>
    </Fieldset>
  )
}
