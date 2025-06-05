import React, { Dispatch, RefObject, SetStateAction } from 'react'
import { PublicQuestion } from '@/types/form'
import { FormField, FormFieldCheckbox, Icon } from '@/components/index'
import { useTranslations } from 'next-intl'
import { FeatureWithDescription } from '@/types/map'
import { useFormStore } from '@/store/form_store'
import { getFirstFeatureOrCurrentAddress } from '@/lib/utils/address'
import { useConfig } from '@/contexts/ConfigContext'
import { FeatureTypeIcon } from '@/app/[locale]/incident/add/components/FeatureTypeIcon'

type FeatureListItemProps = {
  feature: FeatureWithDescription
  field: PublicQuestion
  setError: Dispatch<SetStateAction<string | null>>
  dialogRef: RefObject<HTMLDialogElement>
  configUrl?: string
  setFocusedItemId: Dispatch<SetStateAction<number | null>>
}

export const FeatureListItem = ({
  feature,
  field,
  setError,
  dialogRef,
  setFocusedItemId,
}: FeatureListItemProps) => {
  const t = useTranslations('describe_add.map')
  const { formState, updateForm } = useFormStore()
  const config = useConfig()

  const featureId = feature.id
  const featureDescription = feature.description
  const maxNumberOfAssets = field
    ? field.meta.maxNumberOfAssets
      ? field.meta.maxNumberOfAssets
      : 1
    : 1

  // Add or remove feature to / from the newSelectedFeature state declared in DialogMap
  const addOrRemoveFeature = async (checked: boolean) => {
    const newSelectedFeatureArray = Array.from(
      formState.selectedFeatures ? formState.selectedFeatures : []
    )

    if (checked) {
      if (newSelectedFeatureArray.length >= maxNumberOfAssets) {
        setError(t('max_number_of_assets_error', { max: maxNumberOfAssets }))
        dialogRef.current?.showModal()

        return
      }

      newSelectedFeatureArray.push(feature)
    } else {
      const index = newSelectedFeatureArray.findIndex(
        (feature) => feature.id === featureId
      )

      newSelectedFeatureArray.splice(index, 1) // Remove the feature at the found index
      setTimeout(() => {
        setFocusedItemId(null)
      }, 10)
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
  }

  // TODO: iets van een label toevoegen zodat voor een SR duidelijk wordt om welke lantaarnpaal, adres etc het gaat?
  return featureDescription ? (
    <li className="py-4 border-t disabled-border-1">
      <FormField
        className="flex flex-row items-center gap-2"
        onFocus={(e) => {
          setTimeout(() => {
            setFocusedItemId(featureId)
          }, 10)
        }}
        onBlur={(e) => {
          setTimeout(() => {
            setFocusedItemId(null)
          }, 0)
        }}
      >
        <FeatureTypeIcon iconUrl={feature.properties?.iconUrl} />
        <FormFieldCheckbox
          label={featureDescription}
          className="!mt-1"
          checked={formState.selectedFeatures.some(
            (featureItem) => featureItem.id === featureId
          )}
          id={featureId.toString()}
          // @ts-ignore
          onChange={(e) => addOrRemoveFeature(e.target.checked)}
          onFocus={(evt) => {
            const label = evt.target.closest('label')
            if (label) {
              label.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest',
              })
            }
          }}
        />
      </FormField>
    </li>
  ) : null
}
