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
