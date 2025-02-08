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
      selectUserFields: input.select,
    },
    {
      user_id: 'required',
      selectUserFields: 'optional',
    },
  );

  if (error) {
    return operationResult.failure(error);
  }

  const { user_id, selectUserFields } = secureInput;

  const foundUser = await userDataSource.findById({
    id: user_id,
    select: selectUserFields ?? [],
  });

  return operationResult.success(foundUser);
}
