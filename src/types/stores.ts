import { PublicSignalCreate } from '@/sdk'

type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
    }[keyof T]
  : never

// function getTypeForKey<T, K extends keyof T>(obj: T, key: K): T[K] {
//   return obj[key]
// }

type ObjKeys = {
  [key: string]: any
}

type UpdateObject<T> = <K extends keyof T>(key: Paths<T>, value: T[K]) => void

// TODO, check how I can get specific type value belonging to a deeply nested key, to support strongly typed value parameters
type SignalStore = {
  signal: PublicSignalCreate & ObjKeys
  updateSignal: UpdateObject<PublicSignalCreate>
}

type StepperStore = {
  step: 1 | 2 | 3 | 4
  goToStep: (step: 1 | 2 | 3 | 4) => void
}

export type { StepperStore, SignalStore }
