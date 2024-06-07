import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1">
        <div>
          <Sidebar />
        </div>
        <main className="grid flex-1 place-content-center">
          <h1>Restaurants</h1>
        </main>
      </div>
    </div>
  );
}
