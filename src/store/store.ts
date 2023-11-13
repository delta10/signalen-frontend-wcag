import { create } from 'zustand'
import { SignalStore } from '@/types/signal'
import { immer } from 'zustand/middleware/immer'
import { StepperStore } from '@/types/stepper'

const useSignalStore = create<SignalStore>()(
  immer((set) => ({
    signal: {
      text: 'empty',
      location: {
        id: 0,
        address_text: null,
        geometrie: {
          type: undefined,
          coordinates: undefined,
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
    updateSignal: (key, value) =>
      set((state) => {
        if (key != undefined) {
          // TODO: Check how I can support strongly typed key -> value pairs, so that I don't have to set [key: string]: any for the Signal Object
          state.signal[key] = value
        }
      }),
  }))
)

const useStepperStore = create<StepperStore>()((set) => ({
  step: 1,
  goToStep: (step) => set((state) => ({ step: step })),
}))

export { useSignalStore }
