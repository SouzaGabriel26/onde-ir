import { headers } from 'next/headers';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

export default async function Page() {
  const userId = headers().get('x-user-id');

  const userDataSource = createUserDataSource();
  const { data: userData } = await user.findById(userDataSource, {
    id: userId ?? '',
  });

  return (
    <div className="h-full">
      <h1>Dashboard</h1>
      <p>Bem vindo {userData?.name}</p>

      <section className="grid">
        <Link
          className="self-end justify-self-end"
          href={
            userData
              ? '/dashboard/posts/create'
              : '/auth/signin?redirect_reason=not-authenticated'
          }
        >
          <Button variant="secondary">Crie sua postagem</Button>
        </Link>
      </section>
    </div>
  );
}
