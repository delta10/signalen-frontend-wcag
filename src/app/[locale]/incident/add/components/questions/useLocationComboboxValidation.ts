import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useConfig } from '@/contexts/ConfigContext'
import { isAddressOutsideRestrictedArea } from '@/lib/utils/restrictedAreaUtils'
import { useFormStore } from '@/store/form_store'
import { Address } from '@/types/form'
import type { FormStoreState } from '@/types/stores'

type RestrictionErrorState = {
  message: string
  address: FormStoreState['address']
  coordinates: FormStoreState['coordinates']
  selectedFeatures: FormStoreState['selectedFeatures']
} | null

export const useLocationComboboxValidation = (errorMessage?: string) => {
  const config = useConfig()
  const { formState } = useFormStore()
  const t = useTranslations('describe_add.map')
  const [restrictionErrorState, setRestrictionErrorState] =
    useState<RestrictionErrorState>(null)
  const errorMessageId = useId()
  const restrictionErrorId = useId()
  const restrictionError =
    restrictionErrorState?.address === formState.address &&
    restrictionErrorState?.coordinates === formState.coordinates &&
    restrictionErrorState?.selectedFeatures === formState.selectedFeatures
      ? restrictionErrorState.message
      : null
  const comboboxAriaDescribedBy = [
    errorMessage ? errorMessageId : undefined,
    restrictionError ? restrictionErrorId : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  const validateRestrictedAreaSelection = async (address: Address) => {
    const isOutside = await isAddressOutsideRestrictedArea(config, address)

    if (isOutside) {
      setRestrictionErrorState({
        message: t('please_choose_a_point_on_a_road'),
        address: formState.address,
        coordinates: formState.coordinates,
        selectedFeatures: formState.selectedFeatures,
      })
      return false
    }

    setRestrictionErrorState(null)
    return true
  }

  return {
    comboboxAriaDescribedBy: comboboxAriaDescribedBy || undefined,
    comboboxAriaInvalid: Boolean(errorMessage) || Boolean(restrictionError),
    errorMessageId,
    restrictionError,
    restrictionErrorId,
    validateRestrictedAreaSelection,
  }
}
