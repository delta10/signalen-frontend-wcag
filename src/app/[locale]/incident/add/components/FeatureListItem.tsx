import React, { Dispatch, RefObject, SetStateAction, useMemo } from 'react'
import {
  getFeatureDescription,
  getFeatureIdByCoordinates,
  getFeatureType,
} from '@/lib/utils/map'
import { Feature, FeatureCollection } from 'geojson'
import { PublicQuestion } from '@/types/form'
import { useConfig } from '@/hooks/useConfig'
import { MapRef } from 'react-map-gl/maplibre'
import { FormField, FormFieldCheckbox, Icon } from '@/components/index'
import { useTranslations } from 'next-intl'

type FeatureListItemProps = {
  feature: Feature
  field: PublicQuestion
  selectedFeatureIds: Set<number>
  setSelectedFeatureIds: Dispatch<SetStateAction<Set<number>>>
  map: MapRef | undefined
  setError: Dispatch<SetStateAction<string | null>>
  dialogRef: RefObject<HTMLDialogElement>
  features: FeatureCollection | null
  configUrl?: string
}

export const FeatureListItem = ({
  feature,
  field,
  selectedFeatureIds,
  map,
  setSelectedFeatureIds,
  setError,
  dialogRef,
  features,
  configUrl,
}: FeatureListItemProps) => {
  const { config } = useConfig()
  const t = useTranslations('describe-add.map')

  const featureId = useMemo(() => {
    const featureId = feature.id as number
    return featureId
  }, [feature.geometry])

  const featureType = useMemo(() => {
    return getFeatureType(field.meta.featureTypes, feature.properties)
  }, [field.meta.featureTypes, feature.properties])

  const featureDescription = useMemo(() => {
    return getFeatureDescription(featureType, feature.properties)
  }, [featureType, feature.properties])

  const maxNumberOfAssets = useMemo(() => {
    return field ? field.meta.maxNumberOfAssets : 1
  }, [field])

  const addOrRemoveFeature = (value: boolean) => {
    const newSelectedFeatureIds = new Set([...selectedFeatureIds])
    const selectedFeature = features?.features.filter(
      (feature) => feature.id === featureId
    )[0]

    if (value) {
      if (newSelectedFeatureIds.size >= maxNumberOfAssets) {
        setError(t('max_number_of_assets_error', { max: maxNumberOfAssets }))
        dialogRef.current?.showModal()

        return
      }

      newSelectedFeatureIds.add(featureId)

      if (map && selectedFeature && selectedFeature.properties) {
        map.flyTo({
          center: [
            selectedFeature.properties.longitude,
            selectedFeature.properties.latitude,
          ],
          speed: 0.5,
          zoom: 18,
        })
      }
    } else {
      newSelectedFeatureIds.delete(featureId)
    }

    setSelectedFeatureIds(newSelectedFeatureIds)
  }

  // TODO: iets van een label toevoegen zodat voor een SR duidelijk wordt om welke lantaarnpaal, adres etc het gaat?
  return featureDescription && config ? (
    <li className="py-4 border-t border-gray-200">
      <FormField className="flex flex-row items-center gap-2">
        {!selectedFeatureIds.has(featureId) ? (
          <Icon>
            <img src={featureType?.icon.iconUrl} />
          </Icon>
        ) : (
          <Icon>
            <img
              src={configUrl + '/assets/images/feature-selected-marker.svg'}
            />
          </Icon>
        )}
        <FormFieldCheckbox
          label={featureDescription}
          className="!mt-1"
          checked={selectedFeatureIds.has(featureId)}
          id={featureId.toString()}
          // @ts-ignore
          onChange={(e) => addOrRemoveFeature(e.target.checked)}
        />
      </FormField>
    </li>
  ) : null
}
