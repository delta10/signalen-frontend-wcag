import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { Button } from '@/components/ui/Button'
import { QuestionField } from '@/types/form'
import { MapProvider } from 'react-map-gl/maplibre'

export interface LocationSelectProps extends QuestionField {}

export const LocationSelect = ({ field }: LocationSelectProps) => {
  return (
    <div className="relative">
      <LocationMap />
      <MapProvider>
        <MapDialog
          trigger={
            <Button
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
              type="button"
            >
              Kies locatie
            </Button>
          }
        />
      </MapProvider>
    </div>
  )
}
