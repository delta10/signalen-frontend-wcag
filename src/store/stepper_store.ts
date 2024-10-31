import { create } from 'zustand'
import { StepperStore } from '@/types/stores'
import { createJSONStorage, persist } from 'zustand/middleware'

const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      step: 1,
      lastCompletedStep: 0,
      navToSummary: false,

      goToStep: (step: number) => set(() => ({ step })),

      setLastCompletedStep: (step: number) =>
        set(() => ({ lastCompletedStep: step })),

      removeOneStep: () => set((state) => ({ step: state.step - 1 })),

      addOneStep: () => set((state) => ({ step: state.step + 1 })),

      onNavToSummary: (pressed) => set(() => ({ navToSummary: pressed })),
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

export { useStepperStore }
