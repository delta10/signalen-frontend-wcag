import { PublicSignalCreate } from '@/sdk'

type SignalStore = {
  signal: PublicSignalCreate
  updateSignal: (obj: PublicSignalCreate) => void
}

type StepperStore = {
  step: number
  lastCompletedStep: number
  setLastCompletedStep: (step: number) => void
  goToStep: (step: number) => void
  removeOneStep: () => void
  addOneStep: () => void
}

export type { StepperStore, SignalStore }
