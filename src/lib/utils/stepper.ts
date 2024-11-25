import { FormStep } from '@/types/form'
import { Paths, pathToStep, stepToPath } from '@/routing/navigation'

export const getCurrentStep = (path: string): FormStep => {
  return pathToStep[path] || FormStep.STEP_1_DESCRIPTION
}

export const getNextStepPath = (currentStep: FormStep): Paths | null => {
  return stepToPath[currentStep + 1] ? stepToPath[currentStep + 1] : null
}

export const getPreviousStepPath = (currentStep: FormStep): Paths | null => {
  return stepToPath[currentStep - 1] ? stepToPath[currentStep - 1] : null
}

export const getLastPath = (lastStep: FormStep): Paths => {
  return stepToPath[lastStep] ? stepToPath[lastStep] : '/incident'
}
