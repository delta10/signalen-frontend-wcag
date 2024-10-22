import { PublicSignalCreate } from '@/services/client'

type SignalStore = {
  signal: PublicSignalCreate
  updateSignal: (obj: PublicSignalCreate) => void
  resetSignal: () => void
}

type InitialFormState = {
  description: string
  category: string
  sub_category: string
}

type StepperStore = {
  step: number
  lastCompletedStep: number
  setLastCompletedStep: (step: number) => void
  goToStep: (step: number) => void
  removeOneStep: () => void
  addOneStep: () => void
}

export type { StepperStore, SignalStore, InitialFormState }
