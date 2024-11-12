import { FormStep } from '@/types/form'

export const steps = [
  {
    path: '/incident',
    number: FormStep.STEP_1_DESCRIPTION,
  },
  {
    path: '/incident/add',
    number: FormStep.STEP_2_ADD,
  },
  {
    path: '/incident/contact',
    number: FormStep.STEP_3_CONTACT,
  },
  {
    path: '/incident/summary',
    number: FormStep.STEP_4_SUMMARY,
  },
  {
    path: '/incident/thankyou',
    number: FormStep.STEP_5_THANK_YOU,
  },
]

export const getCurrentStep = (path: string) => {
  return steps.find((step) => step.path === path) || steps[0]
}

export const getNextStep = (stepNumber: FormStep) => {
  const nextStepNumber = Math.min(stepNumber + 1, FormStep.STEP_5_THANK_YOU)
  return steps.find((step) => step.number === nextStepNumber) || steps[0]
}

export const getPreviousStep = (stepNumber: FormStep) => {
  const nextStepNumber = Math.max(stepNumber - 1, FormStep.STEP_1_DESCRIPTION)
  return steps.find((step) => step.number === nextStepNumber) || steps[0]
}
