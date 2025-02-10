import Link from 'next/link';

import { Header } from '@/components/Header';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';
import type { FindAllPlacesOutput } from '@/data/place';
import { verify } from '@/utils/verify';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();

  return (
    <div className="relative flex h-full flex-col overflow-hidden lg:max-h-screen">
      <Header userData={userData} />
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
              return (
                <ImageCard
                  clickable={false}
                  className="cursor-default"
                  key={`${index}-${place.name}`}
                  place={place}
                />
              );
            })}
          </div>

          <div className="flex flex-col gap-8">
            {mockedData.secondColumn.map((place, index) => {
              return (
                <ImageCard
                  clickable={false}
                  className="cursor-default"
                  key={`${index}-${place.name}`}
                  place={place}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

const mockedData: Record<string, FindAllPlacesOutput[]> = {
  firstColumn: [
    {
      name: 'Café Bamboo',
      country: 'Brasil',
      state: 'ES',
      images: [
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-03.jpg?raw=true',
      ],
      category_id: '1',
      city: 'Vitória',
      created_at: new Date(),
      created_by: '1',
      id: '1',
      status: 'APPROVED',
      street: 'Rua das Flores',
      updated_at: new Date(),
    },
    {
      name: 'Churrascaria Espeto de Ouro',
      country: 'Brasil',
      state: 'ES',
      images: [
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-01.jpg?raw=true',
      ],
      category_id: '1',
      city: 'Vitória',
      created_at: new Date(),
      created_by: '1',
      id: '2',
      status: 'APPROVED',
      street: 'Rua das Flores',
      updated_at: new Date(),
    },
  ],
  secondColumn: [
    {
      name: 'Restaurante do Porto',
      country: 'Brasil',
      state: 'ES',
      images: [
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-02.jpg?raw=true',
      ],
      category_id: '1',
      city: 'Vitória',
      created_at: new Date(),
      created_by: '1',
      id: '3',
      status: 'APPROVED',
      street: 'Rua das Flores',
      updated_at: new Date(),
    },
    {
      name: 'Madero Steak House',
      country: 'Brasil',
      state: 'ES',
      images: [
        'https://github.com/SouzaGabriel26/onde-ir/blob/main/assets/photo-restaurant-05.jpg?raw=true',
      ],
      category_id: '1',
      city: 'Vitória',
      created_at: new Date(),
      created_by: '1',
      id: '4',
      status: 'APPROVED',
      street: 'Rua das Flores',
      updated_at: new Date(),
    },
  ],
};
