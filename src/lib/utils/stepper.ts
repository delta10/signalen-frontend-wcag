import { FormStep } from '@/types/form'
import { IncidentPaths, pathToStep, stepToPath } from '@/routing/navigation'

export const getCurrentStep = (path: string): FormStep => {
  return pathToStep[path] || FormStep.STEP_1_DESCRIPTION
}

export const getNextStepPath = (
  currentStep: FormStep
): IncidentPaths | null => {
  return stepToPath[currentStep + 1] ? stepToPath[currentStep + 1] : null
}

export const getPreviousStepPath = (
  currentStep: FormStep
): IncidentPaths | null => {
  return stepToPath[currentStep - 1] ? stepToPath[currentStep - 1] : null
}

export const getLastPath = (lastStep: FormStep): IncidentPaths => {
  return stepToPath[lastStep] ? stepToPath[lastStep] : '/incident'
}
