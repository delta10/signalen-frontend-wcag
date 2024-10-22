type FormStoreState = {
  description: string
  category: string
  sub_category: string
  sub_category_url: string
  coordinates: number[]
  email?: string | null
  phone?: string | null
  sharing_allowed?: boolean
}

type FormStore = {
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
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
