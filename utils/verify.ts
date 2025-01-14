import { cookies, headers } from 'next/headers';

import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

import { RedirectType, redirect } from 'next/navigation';
import { constants } from './constants';
import { operationResult } from './operationResult';

async function loggedUser() {
  const userId = (await headers()).get(constants.headerPayloadKey);

  if (!userId) {
    const token = (await cookies()).get(constants.accessTokenKey)?.value;

    if (token) {
      redirect('/dashboard', RedirectType.replace);
    }
  }

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId ?? '',
  });

  if (data) return operationResult.success(data);

  return operationResult.failure({ message: 'Usuário não logado.' });
}

export const verify = Object.freeze({
  loggedUser,
});
