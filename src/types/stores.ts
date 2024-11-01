import { FormStep } from '@/types/form'

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
}

type FormStore = {
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
}

type StepperStore = {
  step: FormStep
  visitedSteps: FormStep[]
  addVisitedStep: (step: FormStep) => void
  resetVisitedSteps: () => void
  navToSummary: boolean
  goBack: boolean
  goToStep: (step: FormStep) => void
  removeOneStep: () => void
  addOneStep: () => void
  onNavToSummary: (pressed: boolean) => void
  onGoBack: (pressed: boolean) => void
}

export type { StepperStore, FormStore, FormStoreState }
