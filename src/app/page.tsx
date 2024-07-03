import Link from 'next/link';

import { Button } from '@/components/ui/Button';
import { Header } from '@/src/components/Header';

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Header />
      <main
        className={`
          flex
          h-screen
          flex-1
          flex-col
          items-center
          justify-center
          gap-16
          lg:grid
          lg:grid-cols-3
          lg:gap-36
          lg:px-40
        `}
      >
        <div className="flex h-full flex-col items-center justify-center">
          <div
            className={`
              flex
              max-w-[450px]
              flex-col
              items-center
              justify-center
              space-y-10
              text-center
              lg:block
              lg:max-w-[350px]
              lg:text-start
            `}
          >
            <h2
              className={`
                text-title
                w-fit
                max-w-[320px]
                text-5xl
                font-semibold
                lg:min-w-[320px]
                lg:text-7xl
              `}
            >
              Viva uma grande experiência
            </h2>

            <p className="text-paragraph max-w-64 lg:max-w-full">
              Descubra locais incríveis para se visitar em cidades maravilhosas.
            </p>

            <div>
              <Link href="#">
                <Button size="lg">Descobrir todos lugares</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex h-full flex-col items-center justify-center">
          <div>
            <p>fotos</p>
            <p>fotos</p>
            <p>fotos</p>
            <p>fotos</p>
          </div>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </main>
    </div>
  );
}
