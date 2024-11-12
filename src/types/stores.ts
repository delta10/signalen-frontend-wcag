import { FormStep } from '@/types/form'
import React from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form'

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
  loaded: boolean
  formState: FormStoreState
  updateForm: (obj: FormStoreState) => void
  resetForm: () => void
  setLoaded: () => void
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
  setNavToSummary: (pressed: boolean) => void
  setGoBack: (pressed: boolean) => void
  form: UseFormReturn<FieldValues> | null
  setForm: (form: UseFormReturn<FieldValues> | null) => void
  formRef: React.RefObject<HTMLFormElement> | null
  setFormRef: (form: React.RefObject<HTMLFormElement> | null) => void
}

export type { StepperStore, FormStore, FormStoreState }
