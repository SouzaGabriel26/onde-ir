import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="flex-1 grid place-items-center">
        <h1>Restaurants</h1>
      </main>
    </div>
  );
}
