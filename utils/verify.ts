import { cookies } from 'next/headers';

import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

import { auth } from '@/models/authentication';
import { constants } from './constants';
import { env } from './env';
import { operationResult } from './operationResult';

async function loggedUser() {
  const token = (await cookies()).get(constants.accessTokenKey)?.value;
  if (!token)
    return operationResult.failure({ message: 'Usuário não logado.' });

  const payload = await auth.verifyToken({
    secret: env.jwt_secret,
    token,
  });

  if (!payload)
    return operationResult.failure({ message: 'Usuário não logado.' });

  const userId = payload.sub;

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId,
  });

  if (!data) {
    return operationResult.failure({
      message: 'Usuário não logado.',
      reason: 'Usuário não encontrado.',
    });
  }

  return operationResult.success(data);
}

export const verify = Object.freeze({
  loggedUser,
});
