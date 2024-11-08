import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Button, Paragraph } from '@/components/index'
import { useFormStore } from '@/store/form_store'
import { getNearestAddressByCoordinate } from '@/services/location/address'
import { useConfig } from '@/hooks/useConfig'
import { isCoordinates } from '@/lib/utils/map'
import { Alert } from '@utrecht/component-library-react/dist/css-module'
import { LinkButton } from '@utrecht/component-library-react'

export interface LocationSelectProps {
  field?: PublicQuestion
}

export const LocationSelect = ({ field }: LocationSelectProps) => {
  const {
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors['location']?.message as string
  const { formState: formStoreState } = useFormStore()
  const [address, setAddress] = useState<string | null>(null)
  const { config } = useConfig()

  useEffect(() => {
    const getAddress = async () => {
      const result = await getNearestAddressByCoordinate(
        formStoreState.coordinates[0],
        formStoreState.coordinates[1],
        config ? config.base.map.find_address_in_distance : 30
      )

      if (result) {
        setAddress(result.weergavenaam)
      } else {
        setAddress(null)
      }
    }

    getAddress()
  }, [formStoreState.coordinates])

  return (
    <div className="w-full">
      {errorMessage && <Alert type="error">{errorMessage}</Alert>}
      <label htmlFor="location-button">
        {field ? field.meta.label : 'Waar is het?'}
      </label>
      <div className="relative w-full">
        <LocationMap />
        <Paragraph>{address}</Paragraph>
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
      {/* TODO: toon locatie, straatnaam bijv. */}
    </div>
  )
}
