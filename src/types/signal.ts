import { PublicSignalCreate } from '@/sdk'

type SignalStore = {
  signal: PublicSignalCreate
  updateSignal: (key: keyof PublicSignalCreate, value: any) => void
}

export type { SignalStore }
