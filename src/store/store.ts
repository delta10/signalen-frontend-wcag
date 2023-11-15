import { create } from 'zustand'
import { SignalStore, StepperStore } from '@/types/stores'
import { immer } from 'zustand/middleware/immer'

const useSignalStore = create<SignalStore>()(
  immer((set) => ({
    signal: {
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
        sharing_allowed: undefined,
        allows_contact: false,
      },
      incident_date_start: '',
    },
    updateSignal: (obj) =>
      set((state) => {
        state.signal = obj
      }),
  }))
)

const useStepperStore = create<StepperStore>()((set) => ({
  step: 1,
  goToStep: (step) => set((state) => ({ step: step })),
  removeOneStep: () =>
    set((state) => ({
      step: state.step - 1,
    })),
  addOneStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),
}))

export { useSignalStore, useStepperStore }
