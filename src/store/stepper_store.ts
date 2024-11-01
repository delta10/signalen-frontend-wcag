import { create } from 'zustand'
import { StepperStore } from '@/types/stores'
import { createJSONStorage, persist } from 'zustand/middleware'
import { FormStep } from '@/types/form'

const useStepperStore = create<StepperStore>()(
  persist(
    (set) => ({
      step: FormStep.STEP_1_DESCRIPTION,
      navToSummary: false,
      visitedSteps: [],

      goToStep: (step: FormStep) => set(() => ({ step })),

      addVisitedStep: (step: FormStep) =>
        set((state) => ({
          visitedSteps: state.visitedSteps.includes(step)
            ? state.visitedSteps
            : [...state.visitedSteps, step],
        })),

      resetVisitedSteps: () => set(() => ({ visitedSteps: [] })),

      removeOneStep: () => set((state) => ({ step: state.step - 1 })),

      addOneStep: () => set((state) => ({ step: state.step + 1 })),

      onNavToSummary: (pressed) => set(() => ({ navToSummary: pressed })),
    }),
    {
      name: 'step',
      partialize: (state) => ({
        step: state.step,
        navToSummary: state.navToSummary,
        visitedSteps: state.visitedSteps,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export { useStepperStore }
