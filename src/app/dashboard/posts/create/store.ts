import { revalidatePath } from 'next/cache';

import { Option } from '@/components/CustomSelect';
import { location } from '@/models/location';
import { feedbackMessage } from '@/src/utils/feedbackMessage';
import { form } from '@/src/utils/form';
import { City, UF } from '@/types';

async function createPostMetadataAction(formData: FormData) {
  'use server';

  type CreatePostInput = {
    name: string;
    country: string;
    state: string;
    city: string;
    street: string;
    num_place: number;
    complement: string;
    description: string;
  };

  const data = form.sanitizeData<CreatePostInput>(formData);

  console.log({ data });
  // TODO: create post metadata (without pass image)

  feedbackMessage.setFeedbackMessage({
    type: 'success',
    content: 'Dados salvos com sucesso. Agora restam apenas as imagens.',
  });

  return revalidatePath('/dashboard/posts/create');
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
  createPostMetadataAction,
  fetchStatesAction,
  getStates,
  getCitiesByStateAction,
  getCities,
  createPlaceImagesAction,
});
