import type { UserDataSource } from '@/data/user';
import type { User } from '@/types';
import { operationResult } from '@/utils/operationResult';

import { validator } from './validator';

export const user = Object.freeze({
  findById,
});

export type FindByIdInput = {
  id: string;
  select?: Array<keyof User>;
};

async function findById(userDataSource: UserDataSource, input: FindByIdInput) {
  const { data: secureInput, error } = validator(
    {
      user_id: input.id,
      select_user_fields: input.select,
    },
    {
      user_id: 'required',
      select_user_fields: 'optional',
    },
  );

  if (error) {
    return operationResult.failure(error);
  }

  const { user_id, select_user_fields } = secureInput;

  const foundUser = await userDataSource.findById({
    id: user_id,
    select: select_user_fields ?? [],
  });

  return operationResult.success(foundUser);
}
