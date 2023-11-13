type StepperStore = {
  step: 1 | 2 | 3 | 4
  goToStep: (step: 1 | 2 | 3 | 4) => void
}

export type { StepperStore }
