import { create } from 'zustand'
import { SignalStore, StepperStore } from '@/types/stores'
import { immer } from 'zustand/middleware/immer'
import { PublicSignalCreate } from '@/services/client'
import { createJSONStorage, persist } from 'zustand/middleware'

const initialSignalState: PublicSignalCreate = {
  text: '',
  location: {
    id: 0,
    address_text: null,
    geometrie: {
      type: undefined,
      coordinates: [0, 0],
    },
    created_by: null,
    bag_validated: false,
  },
  category: {
    sub_category: undefined,
    sub: '',
    sub_slug: '',
    main: '',
    main_slug: '',
    category_url: undefined,
    departments: '',
    created_by: null,
    text: undefined,
    deadline: '',
    deadline_factor_3: '',
  },
  reporter: {
    email: undefined,
    phone: undefined,
    sharing_allowed: false,
    allows_contact: false,
  },
  incident_date_start: '',
}

const useSignalStore = create<SignalStore>()(
  persist(
    immer((set) => ({
      signal: {
        ...initialSignalState,
      },
      updateSignal: (obj) =>
        set((state) => {
          state.signal = obj
        }),
      resetSignal: () => set(() => ({ signal: initialSignalState })),
    })),
    {
      name: 'signal',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      step: 1,
      lastCompletedStep: 0,

      goToStep: (step: number) => set(() => ({ step })),

      setLastCompletedStep: (step: number) =>
        set(() => ({ lastCompletedStep: step })),

      removeOneStep: () => set((state) => ({ step: state.step - 1 })),

      addOneStep: () => set((state) => ({ step: state.step + 1 })),
    }),
    {
      name: 'step',
      partialize: (state) => ({
        step: state.step,
        lastCompletedStep: state.lastCompletedStep,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export { useSignalStore, useStepperStore }
