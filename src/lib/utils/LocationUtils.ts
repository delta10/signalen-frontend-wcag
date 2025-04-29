import { AppConfig } from '@/types/config'
import { RefObject } from 'react'
import { isCoordinateInsideMaxBound } from '@/lib/utils/map'

/**
 * Attempts to retrieve the user's current location using the Geolocation API,
 * verifies if the location is within configured map bounds, and updates the application state accordingly.
 *
 * If the location is outside the bounds or an error occurs (e.g., permission denied, timeout),
 * an error message is set and an optional dialog is shown to inform the user.
 *
 * @param config - Application configuration containing map bounds to validate the position.
 * @param updatePosition - Callback function to update the current position when location is valid.
 * @param setError - Function to set or update the error state; accepts a string or a functional update.
 * @param dialogRef - Optional reference to a `<dialog>` element to be shown on error.
 * @param t - Translation function for retrieving localized error messages.
 */
export const setCurrentLocation = (
  config: AppConfig,
  updatePosition: (lat: number, lng: number) => void,
  setError: (
    value: ((prevState: string | null) => string | null) | string | null
  ) => void,
  dialogRef: RefObject<HTMLDialogElement> | null,
  t: (key: string, values?: Record<string, any>) => string
) => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const isInsideMaxBound = isCoordinateInsideMaxBound(
        position.coords.latitude,
        position.coords.longitude,
        config
          ? config.base.map.maxBounds
          : [
              [0, 0],
              [0, 0],
            ]
      )

      if (isInsideMaxBound) {
        updatePosition(position.coords.latitude, position.coords.longitude)
        setError(null)
        return
      }

      setError(t('outside_max_bound_error'))
      dialogRef?.current?.showModal()
    },
    (locationError) => {
      const locationErrors: { [key: number]: string } = {
        1: t('current_location_permission_error'),
        2: t('current_location_position_error'),
        3: t('current_location_timeout_error'),
      }

      setError(locationErrors[locationError.code])
      dialogRef?.current?.showModal()
    }
  )
}
