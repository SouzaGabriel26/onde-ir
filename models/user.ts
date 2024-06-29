import { UserDataSource } from '@/data/user';
import { operationResult } from '@/src/utils/operationResult';
import { User } from '@/types';

import { validator } from './validator';

export const user = Object.freeze({
  findById,
});

type FindByIdInput = {
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
