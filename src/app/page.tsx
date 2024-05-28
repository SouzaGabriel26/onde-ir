import { Header } from '@/components/Header';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main className="grid flex-1 place-items-center">
        <h1>Restaurants</h1>
      </main>
    </div>
  );
}
