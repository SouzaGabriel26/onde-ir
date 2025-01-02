import { revalidatePath } from 'next/cache';

import type { Option } from '@/components/CustomSelect';
import { createPlaceDataSource } from '@/data/place';
import { location } from '@/models/location';
import {
  type CreatePlaceImagesInput,
  type CreatePlaceInput,
  place,
} from '@/models/place';
import type { City } from '@/types';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

import { createUserDataSource } from '@/data/user';
import { redirect } from 'next/navigation';
import { multiStepFormStore } from './multiStepFormStore';

type CreatedPlaceResultResponse = Awaited<ReturnType<typeof place.create>>;

let createdPlaceResult: CreatedPlaceResultResponse =
  {} as CreatedPlaceResultResponse;

async function createPlaceAction(formData: FormData) {
  'use server';

  const data = form.sanitizeData<CreatePlaceInput>(formData);

  const userDataSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();
  createdPlaceResult = await place.create(userDataSource, placeDataSource, {
    ...data,
    num_place: data.num_place ? Number(data.num_place) : undefined,
    latitude: data.latitude ? Number(data.latitude) : undefined,
    longitude: data.longitude ? Number(data.longitude) : undefined,
  });

  const { data: createdPlace, error } = createdPlaceResult;

  if (error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: error.message,
    });

    return revalidatePath('/dashboard/posts/create');
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: `${createdPlace.name} criado com sucesso!`,
  });

  multiStepFormStore.setStepProgress('place_metadata', 100);
  multiStepFormStore.setCurrentStep('images');

  return revalidatePath('/dashboard/posts/create');
}

function getCreatedPlaceResult() {
  return Object.freeze({
    createdPlaceResult,
  });
}

let cities: Array<City> = [];

async function getCitiesByStateAction(stateId: string | number) {
  'use server';

  const result = await location.getCitiesByState(Number(stateId));

  if (result.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });

    return;
  }

  cities = result.data;
  revalidatePath('/dashboard/posts/create');
}

function getCities() {
  return {
    cityOptions: cities.map<Option>((city) => ({
      label: city.nome,
      value: city.nome,
    })),
  };
}

async function createPlaceImagesAction(input: CreatePlaceImagesInput) {
  'use server';

  const placeDataSource = createPlaceDataSource();
  await place.createImages(placeDataSource, input);

  multiStepFormStore.setStepProgress('images', 100);
  multiStepFormStore.setCurrentStep('final');

  return revalidatePath('/dashboard/posts/create');
}

async function finishPlaceCreationAction() {
  'use server';

  console.log({ createdPlaceResult });

  if (createdPlaceResult.error) return;

  multiStepFormStore.reset();
  redirect(`/dashboard/posts/${createdPlaceResult.data?.id}`);
}

export const store = Object.freeze({
  createPlaceAction,
  getCitiesByStateAction,
  getCities,
  createPlaceImagesAction,
  getCreatedPlaceResult,
  finishPlaceCreationAction,
});
