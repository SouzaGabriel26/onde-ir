import { RedirectType, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { ButtonLoading } from '@/app/dashboard/posts/_components/ButtonLoading';
import { ImageUpload } from '@/app/dashboard/posts/_components/ImageUpload';
import { CustomSelect } from '@/components/CustomSelect';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import { createPlaceDataSource } from '@/data/place';
import { setInputError } from '@/utils/inputError';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';

import {
  type FormSteps,
  multiStepFormStore,
} from './action/multiStepFormStore';
import { store } from './action/store';

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

  const { createdPlaceResult } = store.getCreatedPlaceResult();

  const { stateOptions } = store.getStates();
  const { cityOptions } = store.getCities();

  const placeDataSource = createPlaceDataSource();
  // TODO: refactor `findCategories`
  const categories = await placeDataSource.findCategories();
  const activeCategories = categories.filter((category) => category.is_active);

  return (
    <form className="flex-1 space-y-4">
      <StepsPreview />

      <StepContent step="place_metadata" className="space-y-4">
        <Input
          name="name"
          placeholder="Nome*"
          required
          error={setInputError('name', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />

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

        {cityOptions.length > 0 ? (
          <CustomSelect
            required
            searchable
            label="Cidade*"
            name="city"
            options={cityOptions}
          />
        ) : (
          <Input
            name="city"
            placeholder="Cidade*"
            required
            error={setInputError('city', {
              fields: createdPlaceResult?.error?.fields,
              message: createdPlaceResult?.error?.message,
            })}
          />
        )}

        <Input
          name="street"
          placeholder="Rua*"
          required
          error={setInputError('street', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />

        <Input
          name="num_place"
          placeholder="Número"
          type="number"
          error={setInputError('num_place', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />

        <Input
          name="complement"
          placeholder="Complemento"
          error={setInputError('complement', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />

        <textarea
          name="description"
          className="max-h-32 w-full p-2 text-sm"
          placeholder="Descrição do local"
          // add `setInputError`
        />

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
          <Input
            name="latitude"
            placeholder="Latitude"
            type="number"
            error={setInputError('latitude', {
              fields: createdPlaceResult?.error?.fields,
              message: createdPlaceResult?.error?.message,
            })}
          />

          <Input
            name="longitude"
            placeholder="Longitude"
            type="number"
            error={setInputError('longitude', {
              fields: createdPlaceResult?.error?.fields,
              message: createdPlaceResult?.error?.message,
            })}
          />
        </div>

        <input type="hidden" name="created_by" defaultValue={userData.id} />

        <fieldset className="flex justify-end gap-4">
          <ButtonLoading formAction={store.createPlaceAction}>
            Salvar e ir para próxima etapa
          </ButtonLoading>
        </fieldset>
      </StepContent>

      <StepContent step="images">
        <ImageUpload
          actionOnUpload={async (urls: string[]) => {
            'use server';

            if (createdPlaceResult?.error) return;

            const { id, country, name, state } = createdPlaceResult!.data;
            await store.createPlaceImagesAction({
              place_id: id,
              urls,
              description: `Imagem do local: ${name}, ${country} - ${state}`,
            });
          }}
        />
      </StepContent>

      <StepContent step="final">
        <p className="text-center text-xl text-zinc-300">
          Parabéns! Você concluiu o cadastro do local.
        </p>

        <Button
          className="mt-4 w-full"
          formAction={async () => {
            'use server';

            multiStepFormStore.reset();
            return redirect('/dashboard');
          }}
        >
          Ver post criado
        </Button>
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
              text-xs
              font-medium
              text-zinc-500
              before:absolute
              before:-left-5
              before:content-[">"]
              lg:text-sm
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
