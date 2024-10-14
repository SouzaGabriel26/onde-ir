import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { RedirectType, redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { verify } from '@/utils/verify';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const { error: userNotAuthenticated } = await verify.loggedUser();

  if (userNotAuthenticated) {
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

      <div className="flex flex-grow flex-col overflow-y-auto items-center rounded-md border p-4">
        {children}
      </div>
    </section>
  );
}
