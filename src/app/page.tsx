import Link from 'next/link';

import { Header } from '@/components/Header';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';

import { sanitizeClassName } from '../utils/sanitizeClassName';

export default async function Page() {
  const mockedData = [
    {
      name: 'Café Bamboo',
      country: 'Brasil',
      state: 'ES',
      image_url:
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-03.jpg?raw=true',
    },
    {
      name: 'Churrascaria Espeto de Ouro',
      country: 'Brasil',
      state: 'ES',
      image_url:
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-01.jpg?raw=true',
    },
    {
      name: 'Restaurante do Porto',
      country: 'Brasil',
      state: 'ES',
      image_url:
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-02.jpg?raw=true',
    },
    {
      name: 'Madero Steak House',
      country: 'Brasil',
      state: 'ES',
      image_url:
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-05.jpg?raw=true',
    },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden lg:max-h-screen">
      <Header />
      <main
        className={`
          mt-20
          flex
          flex-1
          flex-col
          items-center
          justify-evenly
          gap-6
          pt-2
          lg:mt-10
          lg:flex-row
          lg:gap-0
          lg:pt-0
        `}
      >
        <section className="flex min-h-fit flex-1 items-center justify-center lg:max-w-fit">
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
                w-fit
                max-w-[320px]
                text-5xl
                font-semibold
                text-primary
                lg:min-w-[320px]
                lg:text-7xl
              `}
            >
              Viva uma grande experiência
            </h2>

            <p className="max-w-64 text-muted-foreground lg:max-w-full">
              Descubra locais incríveis para se visitar em cidades maravilhosas.
            </p>

            <div>
              <Link href="#">
                <Button size="lg">Descobrir todos lugares</Button>
              </Link>
            </div>
          </div>
        </section>

        <section
          className={`
            flex
            h-full
            justify-center
            px-8
            lg:px-0
          `}
        >
          <div
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-4
              p-8
              lg:grid
              lg:min-h-screen
              lg:grid-cols-2
              lg:place-items-center
              lg:gap-8
            `}
          >
            {mockedData.map((place, index) => {
              const description = `${place.country} - ${place.state}`;

              return (
                <ImageCard
                  key={place.name}
                  src={place.image_url}
                  alt={place.name}
                  description={description}
                  title={place.name}
                  className={sanitizeClassName(
                    index === 1 || index === 3 ? 'lg:mt-2' : 'lg:mb-6',
                  )}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
