import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { verify } from '@/utils/verify';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const { data } = await verify.loggedUser();

  return (
    <main className="flex h-screen flex-col overflow-y-hidden">
      <Header userData={data} />

      <div className="mt-16 h-full px-1 py-10 lg:mt-10 lg:px-12">
        {children}
      </div>
    </main>
  );
}
