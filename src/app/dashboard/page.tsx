import { Button } from '@nextui-org/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createUserDataSource } from '@/data/user';
import { auth } from '@/models/authentication';
import { user } from '@/models/user';
import { Header } from '@/src/components/Header';
import { constants } from '@/src/utils/constants';

async function signOut() {
  'use server';

  cookies().delete(constants.accessTokenKey);

  return redirect('/auth/signin');
}

function checkAccessToken() {
  const accessToken = cookies().get(constants.accessTokenKey)?.value;
  const payload = auth.verifyAccessToken({
    accessToken,
  });

  if (!payload) {
    return redirect('/auth/signin');
  }

  return payload;
}

export default async function Page() {
  const payload = checkAccessToken();

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: payload.sub,
  });

  return (
    <main>
      <Header userData={data} />

      <h1>Dashboard</h1>
      <p>Bem vindo, {data?.name}</p>

      <form action={signOut}>
        <Button type="submit">Sair</Button>
      </form>
    </main>
  );
}
