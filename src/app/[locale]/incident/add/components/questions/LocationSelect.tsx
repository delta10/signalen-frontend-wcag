import { LocationMap } from '@/components/ui/LocationMap'
import { MapDialog } from '@/app/[locale]/incident/add/components/MapDialog'
import { Button } from '@/components/index'

export const LocationSelect = (props: any) => {
  return (
    <div className="relative">
      <LocationMap />
      {/* TODO: I can not find the reason why not every element inside this dialog is focusable */}
      <MapDialog
        marker={props.marker}
        trigger={
          <Button
            appearance="primary-action-button"
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border-none"
            type="button"
          >
            Kies locatie
          </Button>
        }
      />
    </div>
  )
}
