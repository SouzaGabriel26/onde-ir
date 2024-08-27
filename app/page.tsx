import Link from 'next/link';

import { Header } from '@/components/Header';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';

export default async function Page() {
  const mockedData = {
    firstColumn: [
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
    ],
    secondColumn: [
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
    ],
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden lg:max-h-screen">
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
          overflow-y-auto
          pt-2
          lg:flex-row
          lg:gap-0
          lg:pt-0
        `}
      >
        <section
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
            <Link href="/dashboard">
              <Button size="lg">Descobrir todos lugares</Button>
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-8 py-4 lg:flex-row">
          <div className="flex flex-col gap-8 first:mt-10">
            {mockedData.firstColumn.map((place, index) => {
              const description = `${place.country} - ${place.state}`;

              return (
                <ImageCard
                  className="animate-fade-in"
                  key={`${index}-${place.name}`}
                  title={place.name}
                  description={description}
                  alt={place.name}
                  src={place.image_url}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-8">
            {mockedData.secondColumn.map((place, index) => {
              const description = `${place.country} - ${place.state}`;

              return (
                <ImageCard
                  className="animate-fade-in"
                  key={`${index}-${place.name}`}
                  title={place.name}
                  description={description}
                  alt={place.name}
                  src={place.image_url}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
