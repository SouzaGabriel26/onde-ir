import type { ReactNode } from 'react';

import { CmsSidebar } from '@/components/CmsSidebar';
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

      <div className="flex h-full justify-between">
        {data?.userRole === 'ADMIN' && <CmsSidebar />}
        <div className="mt-16 h-full px-1 py-10 lg:mt-10 lg:px-12 flex w-full justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}
