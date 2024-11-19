import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { FormStore, FormStoreState } from '@/types/stores'

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
}

const useFormStore = create<FormStore>()(
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

export { useFormStore }
