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
      userId: input.id,
      selectUserFields: input.select,
    },
    {
      userId: 'required',
      selectUserFields: 'optional',
    },
  );

  if (error) {
    return operationResult.failure(error);
  }

  const { userId, selectUserFields } = secureInput;

  const foundUser = await userDataSource.findById({
    id: userId,
    select: selectUserFields ?? [],
  });

  return operationResult.success(foundUser);
}
