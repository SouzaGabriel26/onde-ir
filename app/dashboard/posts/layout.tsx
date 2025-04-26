import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { CreatePostBreadCrumb } from './_components/CreatePostBreadCrumb';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <section className="flex h-full flex-col space-y-10 flex-1">
      <div className="flex flex-grow flex-col overflow-y-auto items-center rounded-md border scrollbar p-4 space-y-4 relative">
        <Link
          href="/dashboard"
          title="Voltar"
          className="absolute top-2 left-2"
        >
          <Button variant="outline">
            <ArrowLeftIcon />
          </Button>
        </Link>
        <CreatePostBreadCrumb />
        {children}
      </div>
    </section>
  );
}
