import { Feature } from 'geojson'
import { Address, FormStep } from '@/types/form'
import { ExtendedFeature } from '@/types/map'

type FormStoreState = {
  description: string
  last_completed_step: FormStep
  main_category: string
  sub_category: string
  coordinates: number[]
  email?: string | null
  phone?: string | null
  selectedFeatures: ExtendedFeature[]
  sharing_allowed?: boolean
  extra_properties: Array<{
    answer:
      | {
          id: string
          label: string
          info: string
        }
      | string
    category_url: string
    id: string
    label: string
  }>
  attachments: File[]
  isBlocking: boolean
  sig_number: string
  address: Address | null
}

type FormStore = {
  loaded: boolean
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
  setLoaded: () => void
}

export type { FormStore, FormStoreState }
