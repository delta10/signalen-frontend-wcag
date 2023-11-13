import { PublicSignalCreate } from '@/sdk'

type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`
    }[keyof T]
  : never

type DeepValue<T, Path extends string> = Path extends keyof T
  ? T[Path]
  : Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? DeepValue<T[Key], Rest>
    : never
  : never

type ObjKeys = {
  [key: string]: any
}

type UpdateObject<T> = <Path extends Paths<T>>(
  key: Path,
  value: DeepValue<T, Path>
) => void

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
