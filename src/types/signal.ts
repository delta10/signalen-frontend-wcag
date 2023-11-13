import { PublicSignalCreate } from '@/sdk'

type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
    }[keyof T]
  : never

type ObjKeys = {
  [key: string]: any
}

type SignalStore = {
  signal: PublicSignalCreate & ObjKeys
  updateSignal: (key: Paths<PublicSignalCreate>, value: any) => void
}

export type { SignalStore }
