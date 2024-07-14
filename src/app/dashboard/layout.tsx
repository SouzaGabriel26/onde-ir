import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';

type Props = {
  children: ReactNode;
};

export default async function Layout({ children }: Props) {
  const userId = headers().get('x-user-id');
  if (!userId) {
    return redirect('/auth/signin');
  }

  const userDataSource = createUserDataSource();
  const { data } = await user.findById(userDataSource, {
    id: userId,
  });

  return (
    <main className="flex h-screen flex-col">
      <Header userData={data} />

      {children}
    </main>
  );
}
