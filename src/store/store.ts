import { create } from 'zustand'
import {
  SignalAttachmentStore,
  SignalStore,
  StepperStore,
} from '@/types/stores'
import { immer } from 'zustand/middleware/immer'
import { PublicSignalCreate } from '@/services/client'

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
  immer((set) => ({
    signal: {
      ...initialSignalState,
    },
    updateSignal: (obj) =>
      set((state) => {
        state.signal = obj
      }),
    resetSignal: () => set(() => ({ signal: initialSignalState })),
  }))
)

const useSignalAttachmentStore = create<SignalAttachmentStore>()(
  immer((set) => ({
    attachments: [],
    updateAttachments: (attachments: File[]) =>
      set((state) => {
        state.attachments = attachments
      }),
    resetAttachments: () => set(() => ({ attachments: [] })),
  }))
)

const useStepperStore = create<StepperStore>()((set) => ({
  step: 1,
  lastCompletedStep: 0,
  goToStep: (step) => set((state) => ({ step: step })),
  setLastCompletedStep: (step) => set((state) => ({ lastCompletedStep: step })),
  removeOneStep: () =>
    set((state) => ({
      step: state.step - 1,
    })),
  addOneStep: () =>
    set((state) => ({
      step: state.step + 1,
    })),
}))

export { useSignalStore, useStepperStore, useSignalAttachmentStore }
