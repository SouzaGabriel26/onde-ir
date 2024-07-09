import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { createUserDataSource } from '@/data/user';
import { auth } from '@/models/authentication';
import { user } from '@/models/user';
import { constants } from '@/src/utils/constants';

async function signOut() {
  'use server';

  cookies().delete(constants.accessTokenKey);

  return redirect('/auth/signin');
}

export default async function Page() {
  const cookieStore = cookies();

  const accessToken = cookieStore.get(constants.accessTokenKey)?.value;
  const payload = auth.verifyAccessToken({
    accessToken,
  });

  if (!payload) {
    return redirect('/auth/signin');
  }

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
