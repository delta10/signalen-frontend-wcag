import { PublicSignalCreate } from '@/sdk'

type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
    }[keyof T]
  : never

type ObjectKeys = {
  [key: string]: any
}

type Signals = PublicSignalCreate & ObjectKeys

type SignalStore = {
  signal: Signals
  updateSignal: (key: Paths<PublicSignalCreate>, value: any) => void
}

export type { SignalStore }
