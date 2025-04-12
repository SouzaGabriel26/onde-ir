import type { UserDataSource } from '@/data/user';
import type { User } from '@/types';
import { operationResult } from '@/utils/operationResult';

import { validator } from './validator';

export const user = Object.freeze({
  findById,
  update,
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

export type UpdateUserInput = {
  user_id: string;
  email?: string;
  name?: string;
  user_name?: string;
  avatar_url?: string;
};

async function update(userDataSource: UserDataSource, input: UpdateUserInput) {
  const validatedInput = validator(
    {
      user_id: input.user_id,
      email: input.email,
      name: input.name,
      user_name: input.user_name,
      avatar_url: input.avatar_url,
    },
    {
      user_id: 'required',
      email: 'optional',
      name: 'optional',
      user_name: 'optional',
      avatar_url: 'optional',
    },
  );

  if (validatedInput.error) return validatedInput;

  const { email, name, user_name, avatar_url, user_id } = validatedInput.data;

  await userDataSource.update({
    user_id,
    email,
    name,
    user_name,
    avatar_url,
  });

  return operationResult.success({});
}
