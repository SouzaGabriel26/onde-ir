import { revalidatePath } from 'next/cache';
import { ReactNode } from 'react';

import { ImageUpload } from '@/app/dashboard/posts/_components/ImageUpload';
import { CustomSelect } from '@/components/CustomSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { sanitizeClassName } from '@/utils/sanitizeClassName';

import { FormSteps, multiStepFormStore } from './multiStepFormStore';
import { store } from './store';

export default async function Page() {
  await store.fetchStatesAction();

  const { stateOptions } = store.getStates();
  const { cityOptions } = store.getCities();

  const { currentStep, formSteps } = multiStepFormStore.getSteps();
  const lastStep = formSteps[formSteps.length - 1];

  return (
    <form className="space-y-4">
      <StepsPreview />

      <StepContent step="place_metadata" className="space-y-4">
        <Input name="name" placeholder="Nome*" required />

        <CustomSelect
          required
          label="País*"
          name="country"
          defaultOption={'Brazil'}
          options={[{ value: 'Brazil', label: 'Brasil' }]}
        />

        <CustomSelect
          required
          searchable
          label="Estado*"
          name="state"
          options={stateOptions}
          actionOnSelect={store.getCitiesByStateAction}
        />

        <CustomSelect
          required
          searchable
          label="Cidade*"
          name="city"
          options={cityOptions}
        />

        <Input name="street" placeholder="Rua*" required />

        <Input name="num_place" placeholder="Número" type="number" />

        <Input name="complement" placeholder="Complemento" />

        <textarea
          name="description"
          className="max-h-32 w-full p-2 text-sm"
          placeholder="Descrição do local"
        ></textarea>

        <CustomSelect
          required
          label="Categoria*"
          name="category_id"
          // TODO: search categories dynamically
          options={[
            { value: 'restaurantes', label: 'Restaurante' },
            { value: 'parques', label: 'Parque' },
            { value: 'museus', label: 'Museu' },
            { value: 'bares', label: 'Bar' },
          ]}
        />

        <div className="flex gap-4">
          <Input name="latitude" placeholder="Latitude" type="number" />

          <Input name="longitude" placeholder="Longitude" type="number" />
        </div>
      </StepContent>

      <StepContent step="images">
        <ImageUpload
          actionOnUpload={async (urls: string[]) => {
            'use server';

            await store.createPlaceImagesAction(urls);

            multiStepFormStore.setStepProgress('images', 100);

            return revalidatePath('/dashboard/posts/create');
          }}
        />
      </StepContent>

      <fieldset className="flex justify-end gap-4">
        <Button
          className={sanitizeClassName(currentStep === lastStep && 'hidden')}
          formAction={async (formData: FormData) => {
            'use server';

            await store.createPostMetadataAction(formData);

            multiStepFormStore.setStepProgress('place_metadata', 100);
            multiStepFormStore.setCurrentStep('images');

            return revalidatePath('/dashboard/posts/create');
          }}
        >
          Próxima etapa
        </Button>
      </fieldset>
    </form>
  );
}

function StepsPreview() {
  const { formSteps, currentStep, stepProgressObject, formStepLabels } =
    multiStepFormStore.getSteps();

  return (
    <div className="flex justify-center gap-8">
      {formSteps.map((step) => (
        <span
          key={step}
          className={sanitizeClassName(
            `
              relative
              text-sm
              font-medium
              text-zinc-500
              before:absolute
              before:-left-5
              before:content-[">"]
            `,
            currentStep === step && 'text-blue-500',
            stepProgressObject[step] === 100 &&
              'text-green-500 before:content-["✓"]',
          )}
        >
          {formStepLabels[step]}
          <Progress className="h-1" value={stepProgressObject[step]} />
        </span>
      ))}
    </div>
  );
}

type StepContentProps = {
  children: ReactNode;
  step: FormSteps;
  className?: string;
};

function StepContent({ children, step, className }: StepContentProps) {
  const { currentStep } = multiStepFormStore.getSteps();

  return (
    <fieldset
      className={sanitizeClassName(step !== currentStep && 'hidden', className)}
    >
      {children}
    </fieldset>
  );
}
