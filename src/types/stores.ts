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
}

type FormStore = {
  loaded: boolean
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
  setLoaded: () => void
}

type StepperStore = {
  step: number
  lastCompletedStep: number
  setLastCompletedStep: (step: number) => void
  goToStep: (step: number) => void
  removeOneStep: () => void
  addOneStep: () => void
}

export type { StepperStore, FormStore, FormStoreState }
