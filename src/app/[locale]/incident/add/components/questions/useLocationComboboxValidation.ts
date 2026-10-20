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
    coordinates: number[]
  } | null>(null)
  const errorMessageId = useId()
  const searchPosition =
    search?.coordinates === formState.coordinates ? search.position : null

  const updatePosition = (lat: number, lng: number, selectPosition = true) => {
    setSearch(
      selectPosition
        ? null
        : {
            position: [lat, lng],
            coordinates: useFormStore.getState().formState.coordinates,
          }
    )
  }
  const validateRestrictedAreaSelection = async (address: Address) => {
    const [lng, lat] = address.coordinates
    return !(await isCoordinateOutsideRestrictedArea(config, lng, lat))
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
