import { headers } from 'next/headers';

import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

export default async function Page() {
  const userId = headers().get('x-user-id');

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId ?? '',
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem vindo {data?.name}</p>
    </div>
  );
}
