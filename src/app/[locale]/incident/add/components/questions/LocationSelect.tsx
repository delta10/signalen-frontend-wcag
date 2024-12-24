import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React from 'react'
import {
  Button,
  Paragraph,
  Fieldset,
  FieldsetLegend,
  FormFieldDescription,
} from '@/components/index'
import { useFormStore } from '@/store/form_store'
import { isCoordinates } from '@/lib/utils/map'
import { useTranslations } from 'next-intl'
import { FormFieldErrorMessage } from '@/components'
import { AddressCombobox } from '@/components/ui/AddressCombobox'

export interface LocationSelectProps {
  field?: PublicQuestion
}

export const LocationSelect = ({ field }: LocationSelectProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()
  const errorMessage = errors['location']?.message as string
  const { formState: formStoreState } = useFormStore()
  const t = useTranslations('describe_add.map')
  const tGeneral = useTranslations('general')

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
                    formStoreState.address &&
                    formStoreState.address.weergave_naam
                      ? t('chosen_location', {
                          location: formStoreState.address.weergave_naam,
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
      </div>
    </Fieldset>
  )
}
