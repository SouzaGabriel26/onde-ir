import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { verify } from '@/utils/verify';

export default async function Page() {
  const { data: userData, error: userNotAuthenticated } =
    await verify.loggedUser();

  return (
    <div className="h-full">
      <h1>Dashboard</h1>
      <p>Bem vindo {userData?.name}</p>

      <section className="grid">
        <Link
          className="self-end justify-self-end"
          href={
            userNotAuthenticated
              ? '/auth/signin?redirect_reason=not-authenticated'
              : '/dashboard/posts/create'
          }
        >
          <Button variant="secondary">Crie sua postagem</Button>
        </Link>
      </section>
    </div>
  );
}
