import { headers } from 'next/headers';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const userId = headers().get('x-user-id');

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId ?? '',
  });

  return (
    <main className="flex h-screen flex-col">
      <Header userData={data} />

      <div className="mt-16 h-full px-4 py-10 lg:mt-10 lg:px-40">
        {children}
      </div>
    </main>
  );
}
