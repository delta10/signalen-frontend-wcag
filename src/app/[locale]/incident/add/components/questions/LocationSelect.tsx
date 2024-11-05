import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { Button, Paragraph } from '@/components/index'
import { useFormStore } from '@/store/form_store'
import { getNearestAddressByCoordinate } from '@/services/location/address'

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

  useEffect(() => {
    const getAddress = async () => {
      const result = await getNearestAddressByCoordinate(
        formStoreState.coordinates[0],
        formStoreState.coordinates[1],
        10
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
    <div className="relative w-full">
      {errorMessage && (
        <Paragraph
          id="location-error"
          aria-live="assertive"
          style={{ color: 'red' }}
        >
          {errorMessage}
        </Paragraph>
      )}
      <label htmlFor="location-button">
        {field ? field.meta.label : 'Waar is het?'}
      </label>
      <LocationMap />
      <Paragraph>{address}</Paragraph>
      <MapProvider>
        <MapDialog
          trigger={
            formStoreState.coordinates[0] === 0 &&
            formStoreState.coordinates[1] === 0 ? (
              <Button
                id="location-button"
                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
                type="button"
              >
                Kies locatie
              </Button>
            ) : (
              <button id="location-button" type="button">
                Wijzig locatie
              </button>
            )
          }
        />
      </MapProvider>
      {/* TODO: toon locatie, straatnaam bijv. */}
    </div>
  )
}
