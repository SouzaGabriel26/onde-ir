const formSteps = ['place_metadata', 'images'] as const;
export type FormSteps = (typeof formSteps)[number];

let currentStep: FormSteps = formSteps[0];

const stepProgressObject: Record<FormSteps, number> = {
  place_metadata: 0,
  images: 0,
};

const formStepLabels: Record<FormSteps, string> = {
  place_metadata: 'Dados sobre o local',
  images: 'Imagens',
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

export const multiStepFormStore = Object.freeze({
  getSteps,
  setCurrentStep,
  setStepProgress,
});
