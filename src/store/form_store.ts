import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { FormStore, FormStoreState } from '@/types/stores'
import { FormStep, isMinimalAddress } from '@/types/form'
import merge from 'lodash/merge'

const initialFormState: FormStoreState = {
  description: '',
  main_category: 'overig',
  sub_category: 'overig',
  coordinates: [0, 0],
  email: undefined,
  phone: undefined,
  sharing_allowed: false,
  extra_properties: [],
  attachments: [],
  isBlocking: false,
  selectedFeatures: [],
  sig_number: '',
  address: null,
  last_completed_step: FormStep.STEP_0,
}

export const defaultStep3FormState: Partial<FormStoreState> = {
  description: 'lamp',
  coordinates: [51.61892134, 5.52874105],
  address: {
    coordinates: [5.52874105, 51.61892134],
    id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
    postcode: '5462GJ',
    huisnummer: '3A',
    woonplaats: 'Veghel',
    openbare_ruimte: 'Lage Landstraat',
    weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
  },
  last_completed_step: 2,
}

export const defaultStep4FormState: Partial<FormStoreState> = {
  description: 'lamp',
  coordinates: [51.61892134, 5.52874105],
  address: {
    coordinates: [5.52874105, 51.61892134],
    id: 'adr-987acc537500c2f62ab7449a6d1e6f2e',
    postcode: '5462GJ',
    huisnummer: '3A',
    woonplaats: 'Veghel',
    openbare_ruimte: 'Lage Landstraat',
    weergave_naam: 'Lage Landstraat 3A, 5462GJ Veghel',
  },
  last_completed_step: 3,
}

export const createFormState = (
  data: Partial<FormStoreState>
): FormStoreState => merge({}, initialFormState, data)

export const useFormStore = create<FormStore>()(
  persist(
    immer((set) => ({
      formState: {
        ...initialFormState,
      },
      loaded: false,
      updateForm: (obj) =>
        set((state) => {
          state.formState = obj
        }),
      resetForm: () => set(() => ({ formState: initialFormState })),
      setLoaded: () => set(() => ({ loaded: true })),
    })),
    {
      name: 'form',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoaded()
        }
      },
    }
  )
)

export const createSessionStorageFixture = (
  data: Partial<FormStoreState>
): { [index: string]: string } => {
  const formState = createFormState(data)
  return {
    form: JSON.stringify({
      state: {
        formState,
        loaded: false,
      },
      version: 0,
    }),
  }
}

export const isValidForStep2 = (formState: FormStoreState) => {
  return formState.description.length >= 1
}

export const isValidForStep3 = (formState: FormStoreState) => {
  return (
    isValidForStep2(formState) &&
    !!formState.address &&
    isMinimalAddress(formState.address)
  )
}
