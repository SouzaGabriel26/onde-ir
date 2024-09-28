const formSteps = ['place_metadata', 'images', 'final'] as const;
export type FormSteps = (typeof formSteps)[number];

let currentStep: FormSteps = formSteps[0];

const stepProgressObject: Record<FormSteps, number> = {
  place_metadata: 0,
  images: 0,
  final: 0,
};

const formStepLabels: Record<FormSteps, string> = {
  place_metadata: 'Dados sobre o local',
  images: 'Imagens',
  final: 'Final',
};

function getSteps() {
  return {
    formSteps,
    currentStep,
    stepProgressObject,
    formStepLabels,
  };
}

async function setCurrentStep(step: FormSteps) {
  'use server';

  currentStep = step;
}

async function setStepProgress(step: FormSteps, progress: number) {
  'use server';

  stepProgressObject[step] = progress;
}

async function reset() {
  'use server';

  currentStep = formSteps[0];
  for (const step of Object.keys(stepProgressObject)) {
    stepProgressObject[step as FormSteps] = 0;
  }
}

export const multiStepFormStore = Object.freeze({
  getSteps,
  setCurrentStep,
  setStepProgress,
  reset,
});
