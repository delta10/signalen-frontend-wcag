import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { PublicQuestion } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'
import { useFormContext } from 'react-hook-form'
import React from 'react'
import { Button, Paragraph } from '@/components/index'

export interface LocationSelectProps {
  field?: PublicQuestion
}

export const LocationSelect = ({ field }: LocationSelectProps) => {
  const {
    formState: { errors },
  } = useFormContext()
  const errorMessage = errors['location']?.message as string

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
      <MapProvider>
        <MapDialog
          trigger={
            <Button
              id="location-button"
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
              type="button"
            >
              Kies locatie
            </Button>
          }
        />
      </MapProvider>
      {/* TODO: toon locatie, straatnaam bijv. */}
      <Paragraph>Locatie</Paragraph>
    </div>
  )
}
