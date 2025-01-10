import type { PlaceDataSource, PlaceStatus } from '@/data/place';
import type { UserDataSource } from '@/data/user';
import { operationResult } from '@/utils/operationResult';

import { type ValidationSchema, validator } from './validator';

export const place = Object.freeze({
  findAll,
  findById,
  create,
  createImages,
  findCategories,
});

type FindAllInput = {
  page?: ValidationSchema['page'];
  limit?: ValidationSchema['limit'];
  where?: {
    status?: PlaceStatus;
    state?: string;
    name?: string;
  };
};

async function findAll(
  placeDataSource: PlaceDataSource,
  input: FindAllInput = {},
) {
  input.page = input.page ?? 1;
  input.limit = input.limit ?? 10;

  const { data: secureInput, error } = validator(
    {
      page: input.page,
      limit: input.limit,
      state: input.where?.state,
      name: input.where?.name,
      status: input.where?.status,
    },
    {
      limit: 'required',
      page: 'required',
      state: 'optional',
      name: 'optional',
      status: 'optional',
    },
  );

  if (error) return operationResult.failure(error);

  const { page, limit } = secureInput;
  const offset = (page - 1) * limit;

  const places = await placeDataSource.findAll({
    offset,
    limit,
    where: input.where,
  });

  return operationResult.success(places);
}

async function findById(placeDataSource: PlaceDataSource, id: string) {
  const validationResult = validator(
    { place_id: id },
    { place_id: 'required' },
  );

  if (validationResult.error) return validationResult;

  const place = await placeDataSource.findById(id);

  if (!place) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  return operationResult.success(place);
}
export type CreatePlaceInput = {
  name: string;
  country: string;
  state: string;
  city: string;
  street: string;
  num_place?: number;
  complement?: string;
  description?: string;
  category_id: string;
  latitude?: number;
  longitude?: number;
  created_by: string;
};

async function create(
  userDataSource: UserDataSource,
  placeDataSource: PlaceDataSource,
  props: CreatePlaceInput,
) {
  const { data: validatedInput, error } = validator(
    { ...props },
    {
      name: 'required',
      country: 'required',
      state: 'required',
      city: 'required',
      street: 'required',
      category_id: 'required',
      created_by: 'required',
      num_place: 'optional',
      complement: 'optional',
      description: 'optional',
      latitude: 'optional',
      longitude: 'optional',
    },
  );

  if (error) return operationResult.failure(error);

  const categories = await placeDataSource.findCategories();
  const categoryExists = categories.some(
    (c) => c.id === validatedInput.category_id,
  );

  if (!categoryExists) {
    return operationResult.failure({
      message: 'ID da categoria não encontrada.',
      fields: ['category_id'],
    });
  }

  const userExists = await userDataSource.checkById({
    id: validatedInput.created_by,
  });

  if (!userExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['created_by'],
    });
  }

  const { data: places } = await findAll(placeDataSource, {
    limit: 1,
    where: {
      name: validatedInput.name,
    },
  });

  if (places && places.length > 0) {
    return operationResult.failure({
      message: `Já existe um local registrado com o nome ${validatedInput.name}.`,
      fields: ['name'],
    });
  }

  const createdPlace = await placeDataSource.create(validatedInput);

  return operationResult.success(createdPlace);
}

export type CreatePlaceImagesInput = {
  place_id: string;
  urls: Array<string>;
  description: string;
};

async function createImages(
  placeDataSource: PlaceDataSource,
  input: CreatePlaceImagesInput,
) {
  const { data: validatedInput, error } = validator(
    { ...input },
    {
      place_id: 'required',
      urls: 'required',
      description: 'required',
    },
  );

  if (error) return operationResult.failure(error);

  const placeExists = await placeDataSource.findById(input.place_id);
  if (!placeExists) {
    return operationResult.failure({
      message: 'Local não encontrado.',
      fields: ['place_id'],
    });
  }

  await placeDataSource.createImages(validatedInput);

  return operationResult.success({});
}

export type FindCategoriesInput = {
  where?: {
    is_active?: boolean;
  };
};

async function findCategories(
  placeDataSource: PlaceDataSource,
  input?: FindCategoriesInput,
) {
  const categories = await placeDataSource.findCategories(input);

  return operationResult.success(categories);
}
