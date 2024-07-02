import { PlaceDataSource } from '@/data/place';
import { operationResult } from '@/src/utils/operationResult';

import { ValidationSchema, validator } from './validator';

export const place = Object.freeze({
  findAll,
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
