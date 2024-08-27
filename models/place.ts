import { PlaceDataSource } from '@/data/place';
import { createUserDataSource } from '@/data/user';
import { operationResult } from '@/utils/operationResult';

import { ValidationSchema, validator } from './validator';

export const place = Object.freeze({
  findAll,
  create,
});

type FindAllInput = {
  page?: ValidationSchema['page'];
  limit?: ValidationSchema['limit'];
  where?: {
    approved?: 'true' | 'false';
    state?: string;
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
    },
    {
      limit: 'required',
      page: 'required',
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

  const userDataSource = createUserDataSource();
  const userExists = await userDataSource.checkById({
    id: validatedInput.created_by,
  });

  if (!userExists) {
    return operationResult.failure({
      message: 'Usuário não encontrado.',
      fields: ['created_by'],
    });
  }

  const result = await placeDataSource.create(validatedInput);

  return operationResult.success({ place: result });
}
