import Link from 'next/link';

import { Header } from '@/src/components/Header';

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="grid flex-1 place-content-center">
        <h1>Restaurants</h1>
        <Link href="/dashboard">Dashboard</Link>
      </main>
    </div>
  );
}
