import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider, MapRef } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  LinkButton,
  Fieldset,
  FieldsetLegend,
  FormFieldDescription,
} from '@/components/index'
import { useFormStore } from '@/store/form_store'
import { useConfig } from '@/hooks/useConfig'
import { formatAddressToSignalenInput, isCoordinates } from '@/lib/utils/map'
import { useTranslations } from 'next-intl'
import { FormFieldErrorMessage } from '@/components'
import { getGeoJsonFeatures } from '@/services/location/features'
import { FeatureCollection } from 'geojson'
import { AddressCombobox } from '@/components/ui/AddressCombobox'
import { getNearestAddressByCoordinate } from '@/services/location/address'
import { ParagraphOrList } from '@/components/ui/ParagraphOrList'

export interface AssetSelectProps {
  field?: PublicQuestion
}

export const AssetSelect = ({ field }: AssetSelectProps) => {
  const {
    setValue,
    formState: { errors },
    register,
  } = useFormContext()
  const errorMessage = errors['location']?.message as string
  const { formState: formStoreState } = useFormStore()
  const { config } = useConfig()
  const t = useTranslations('describe_add.map')
  const tGeneral = useTranslations('general')
  const [dialogMap, setDialogMap] = useState<MapRef | null>(null)
  const [features, setFeatures] = useState<FeatureCollection | null>(null)

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
        zoom >= config.base.map.minimal_zoom
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
      dialogMap.on('load', setNewFeatures)

      dialogMap.on('move', setNewFeatures)
    }

    return () => {
      if (dialogMap) {
        dialogMap.off('load', setNewFeatures)
        dialogMap.off('move', setNewFeatures)
      }
    }
  }, [config, dialogMap, field])

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
  }, [config, field, formStoreState.selectedFeatures, setValue])

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

      <FormFieldDescription>
        {t('choose_address_description')}
      </FormFieldDescription>

      <div className="mb-4" {...register('location')}>
        <AddressCombobox />
      </div>

      <FormFieldDescription>{t('use_map_description')}</FormFieldDescription>
      <div className="relative w-full">
        <div style={{ minHeight: 200, height: 200 }} role="img" aria-label="">
          <LocationMap />
        </div>
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
                  {t('choose_location')}
                </Button>
              ) : (
                <Button
                  appearance="secondary-action-button"
                  id="location-button"
                  className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                  type="button"
                  aria-label={
                    formStoreState.selectedFeatures.length
                      ? formStoreState.address &&
                        formStoreState.address.weergave_naam
                        ? t('chosen_location_address_and_points', {
                            location: formStoreState.address.weergave_naam,
                            points: formStoreState.selectedFeatures
                              .map((feature: any) => feature.description)
                              .join(', '),
                          })
                        : t('chosen_location_points', {
                            points: formStoreState.selectedFeatures
                              .map((feature: any) => feature.description)
                              .join(', '),
                          })
                      : t('edit_location')
                  }
                >
                  {t('edit_location')}
                </Button>
              )
            }
          />
        </MapProvider>
      </div>
      <div>
        <Paragraph>{formStoreState.address?.weergave_naam}</Paragraph>
        <ParagraphOrList
          entries={formStoreState.selectedFeatures.map((feature: any) => [
            feature.id,
            feature.description,
          ])}
        />
      </div>
    </Fieldset>
  )
}
