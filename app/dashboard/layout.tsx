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
        <div className="mt-10 h-full py-10 px-12 flex w-full justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}
