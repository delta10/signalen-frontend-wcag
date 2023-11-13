import { PublicSignalCreate } from '@/sdk'

type SignalStore = {
  signal: PublicSignalCreate
  updateSignal: (obj: PublicSignalCreate) => void
}

type StepperStore = {
  step: number
  goToStep: (step: number) => void
  removeOneStep: () => void
  addOneStep: () => void
}

export type { StepperStore, SignalStore }
