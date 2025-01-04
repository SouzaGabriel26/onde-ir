'use server';

import { revalidatePath } from 'next/cache';

import { type CreatePlaceOutput, createPlaceDataSource } from '@/data/place';
import { location } from '@/models/location';
import {
  type CreatePlaceImagesInput,
  type CreatePlaceInput,
  place,
} from '@/models/place';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

import { createUserDataSource } from '@/data/user';
import { constants } from '@/utils/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { multiStepFormStore } from './multiStepFormStore';

type CreatedPlaceResultResponse = Awaited<ReturnType<typeof place.create>>;

export type CreatePlaceActionResponse = CreatedPlaceResultResponse & {
  inputs?: Partial<CreatePlaceInput>;
};

export async function createPlaceAction(
  _prevState: CreatePlaceActionResponse,
  formData: FormData,
): Promise<CreatePlaceActionResponse> {
  'use server';

  const data = form.sanitizeData<CreatePlaceInput>(formData);

  const userDataSource = createUserDataSource();
  const placeDataSource = createPlaceDataSource();
  const createdPlaceResult = await place.create(
    userDataSource,
    placeDataSource,
    {
      ...data,
      num_place: data.num_place ? Number(data.num_place) : undefined,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
    },
  );

  const { data: createdPlace, error } = createdPlaceResult;

  if (error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: error.message,
    });

    return {
      data: createdPlace,
      error,
      inputs: data,
    };
  }

  await feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: `${createdPlace.name} criado com sucesso!`,
  });

  multiStepFormStore.setStepProgress('place_metadata', 100);
  multiStepFormStore.setCurrentStep('images');

  (await cookies()).set(
    constants.uncompletedPlaceCreatedKey,
    JSON.stringify(createdPlace),
  );

  redirect(`/dashboard/posts/${createdPlace.id}/create/images`);
}

export async function getCitiesByStateAction(stateId: string | number) {
  const result = await location.getCitiesByState(Number(stateId));

  if (result.error) {
    await feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: result.error.message,
    });

    return { cities: [] };
  }

  const cities = result.data;
  return { cities };
}

export async function createPlaceImagesAction(input: CreatePlaceImagesInput) {
  const placeDataSource = createPlaceDataSource();
  await place.createImages(placeDataSource, input);

  multiStepFormStore.setStepProgress('images', 100);
  multiStepFormStore.setCurrentStep('final');

  return revalidatePath('/dashboard/posts/create');
}

export async function dismissUncompletedPlaceCreationAction() {
  // TODO: delete uncompleted place created from database

  (await cookies()).delete(constants.uncompletedPlaceCreatedKey);

  redirect('/dashboard/posts/create');
}

export async function getUncompletedPlaceCreatedAction() {
  const cookieStore = await cookies();

  const uncompletedPlaceCreated = cookieStore.get(
    constants.uncompletedPlaceCreatedKey,
  )?.value;

  const parsedUncompletedPlace = uncompletedPlaceCreated
    ? (JSON.parse(uncompletedPlaceCreated) as CreatePlaceOutput)
    : null;

  return parsedUncompletedPlace;
}
