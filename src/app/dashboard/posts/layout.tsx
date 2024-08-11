import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const userId = headers().get('x-user-id') ?? '';

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId,
  });

  if (!data) {
    return redirect(
      '/auth/signin?redirect_reason=not-authenticated',
      RedirectType.replace,
    );
  }

  return (
    <section className="flex h-full flex-col space-y-10">
      <div>
        <Link href="/dashboard" title="Voltar">
          <Button variant="outline">
            <ArrowLeftIcon />
          </Button>
        </Link>
      </div>

      <div className="flex flex-grow flex-col items-center rounded-md border p-4">
        {children}
      </div>
    </section>
  );
}
