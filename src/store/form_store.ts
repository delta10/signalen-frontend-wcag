import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { FormStore, FormStoreState } from '@/types/stores'

const initialFormState: FormStoreState = {
  description: '',
  main_category: '',
  sub_category: '',
  coordinates: [0, 0],
  email: '',
  phone: '',
  sharing_allowed: false,
}

const useFormStore = create<FormStore>()(
  persist(
    immer((set) => ({
      formState: {
        ...initialFormState,
      },
      updateForm: (obj) =>
        set((state) => {
          state.formState = obj
        }),
      resetForm: () => set(() => ({ formState: initialFormState })),
    })),
    {
      name: 'form',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export { useFormStore }
