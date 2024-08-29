import { revalidatePath } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';
import { ReactNode } from 'react';

import { ImageUpload } from '@/app/dashboard/posts/_components/ImageUpload';
import { CustomSelect } from '@/components/CustomSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { createPlaceDataSource } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';

import { FormSteps, multiStepFormStore } from './multiStepFormStore';
import { store } from './store';

export default async function Page() {
  const { data: userData, error: userNotAuthenticated } =
    await verify.loggedUser();

  if (userNotAuthenticated) {
    return redirect(
      '/auth/signin?redirect_reason=not-authenticated',
      RedirectType.replace,
    );
  }

  await store.fetchStatesAction();

  const { stateOptions } = store.getStates();
  const { cityOptions } = store.getCities();

  const placeDataSource = createPlaceDataSource();
  // TODO: refactor `findCategories`
  const categories = await placeDataSource.findCategories();
  const activeCategories = categories.filter((category) => category.is_active);

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
          options={activeCategories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />

        <div className="flex gap-4">
          <Input name="latitude" placeholder="Latitude" type="number" />

          <Input name="longitude" placeholder="Longitude" type="number" />
        </div>

        <input type="hidden" name="created_by" defaultValue={userData.id} />

        <fieldset className="flex justify-end gap-4">
          <Button
            className={sanitizeClassName(currentStep === lastStep && 'hidden')}
            formAction={async (formData: FormData) => {
              'use server';

              await store.createPlaceAction(formData);

              multiStepFormStore.setStepProgress('place_metadata', 100);
              multiStepFormStore.setCurrentStep('images');

              return revalidatePath('/dashboard/posts/create');
            }}
          >
            Salvar e ir para próxima etapa
          </Button>
        </fieldset>
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
          title={formStepLabels[step]}
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
