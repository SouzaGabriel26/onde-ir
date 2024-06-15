import { Button } from '@nextui-org/react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { constants } from '@/src/utils/constants';

async function signOut() {
  'use server';

  cookies().delete(constants.accessTokenKey);

  return redirect('/auth/signin');
}

export default function Page() {
  // TODO: validate accessToken integrity

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Essa é a página do dashboard</p>

      <form action={signOut}>
        <Button type="submit">Sair</Button>
      </form>
    </div>
  );
}
