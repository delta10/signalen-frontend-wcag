import { useId, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext'
import { isCoordinateOutsideRestrictedArea } from '@/lib/utils/restrictedAreaUtils'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'

export const useLocationComboboxValidation = (errorMessage?: string) => {
  const config = useConfig()
  const { formState } = useFormStore()
  const [search, setSearch] = useState<{
    position: [number, number]
    address: Address | null
    coordinates: number[]
  } | null>(null)
  const searchPosition =
    search?.address === formState.address &&
    search?.coordinates === formState.coordinates
      ? search.position
      : null
  const updatePosition = (lat: number, lng: number, selectPosition = true) => {
    const current = useFormStore.getState().formState
    setSearch(
      selectPosition
        ? null
        : {
            position: [lat, lng],
            address: current.address,
            coordinates: current.coordinates,
          }
    )
  }
  const errorMessageId = useId()
  const validateRestrictedAreaSelection = async (address: Address) => {
    const [lng, lat] = address.coordinates
    const isOutside = await isCoordinateOutsideRestrictedArea(config, lng, lat)

    return !isOutside
  }

  return {
    comboboxAriaDescribedBy: errorMessage ? errorMessageId : undefined,
    comboboxAriaInvalid: Boolean(errorMessage),
    errorMessageId,
    searchPosition,
    updatePosition,
    validateRestrictedAreaSelection,
  }
}
