import { create } from 'zustand'
import { StepperStore } from '@/types/stores'
import { createJSONStorage, persist } from 'zustand/middleware'

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

export { useStepperStore }
