type FormStoreState = {
  description: string
  main_category: string
  sub_category: string
  coordinates: number[]
  email?: string | null
  phone?: string | null
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
  address: string | null
}

type FormStore = {
  loaded: boolean
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
  setLoaded: () => void
}

export type { FormStore, FormStoreState }
