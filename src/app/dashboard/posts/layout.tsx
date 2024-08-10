import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
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
