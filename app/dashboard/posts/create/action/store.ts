import { revalidatePath } from 'next/cache';

import { Option } from '@/components/CustomSelect';
import { createPlaceDataSource } from '@/data/place';
import { location } from '@/models/location';
import { CreatePlaceInput, place } from '@/models/place';
import { City, UF } from '@/types';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { form } from '@/utils/form';

import { multiStepFormStore } from './multiStepFormStore';

let createPlaceError: Awaited<ReturnType<typeof place.create>>['error'];

async function createPlaceAction(formData: FormData) {
  'use server';

  const data = form.sanitizeData<CreatePlaceInput>(formData);

  const placeDataSource = createPlaceDataSource();
  const { data: createdPlace, error } = await place.create(placeDataSource, {
    ...data,
    num_place: data.num_place ? Number(data.num_place) : undefined,
    latitude: data.latitude ? Number(data.latitude) : undefined,
    longitude: data.longitude ? Number(data.longitude) : undefined,
  });

  if (error) {
    createPlaceError = error;

    feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: error.message,
    });

    return revalidatePath('/dashboard/posts/create');
  }

  feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: `${createdPlace.name} criado com sucesso!`,
  });

  multiStepFormStore.setStepProgress('place_metadata', 100);
  multiStepFormStore.setCurrentStep('images');

  return revalidatePath('/dashboard/posts/create');
}

function getCreatePlaceError() {
  return Object.freeze({
    createPlaceError,
  });
}

let states: Array<UF> = [];

async function fetchStatesAction() {
  'use server';

  const { data } = await location.getStates();

  states = data;

  revalidatePath('/dashboard/posts/create');
}

function getStates() {
  return {
    stateOptions: states.map<Option>((state) => ({
      label: state.nome,
      value: state.sigla,
    })),
  };
}

let cities: Array<City> = [];

async function getCitiesByStateAction(sigla: string) {
  'use server';

  const stateId = states.find((state) => state.sigla === sigla)?.id;

  if (!stateId) {
    feedbackMessage.setFeedbackMessage({
      type: 'error',
      content: 'Erro ao buscar cidades. Tente novamente.',
    });

    return;
  }

  const result = await location.getCitiesByState(stateId);

  if (result.error) {
    feedbackMessage.setFeedbackMessage({
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

async function createPlaceImagesAction(urls: Array<string>) {
  'use server';

  console.log({ urls });
}

export const store = Object.freeze({
  createPlaceAction,
  fetchStatesAction,
  getStates,
  getCitiesByStateAction,
  getCities,
  createPlaceImagesAction,
  getCreatePlaceError,
});
