import Link from 'next/link';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import type { FindAllPlacesOutput } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();

  return (
    <div className="relative flex h-full flex-col lg:max-h-screen">
      <Header userData={userData} />
      <main
        className={`
          mt-5
          flex
          flex-1
          flex-col
          items-center
          justify-between
          gap-4
          2xl:flex-row
          pt-2
          p-4
        `}
      >
        <section
          className={`
            flex
            flex-col
            items-center
            2xl:items-start
            justify-center
            gap-4
            text-center
            2xl:text-start
          `}
        >
          <h2
            className={`
              w-fit
              text-5xl
              font-semibold
              text-primary
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

        <section className="flex flex-col gap-4 py-4 lg:flex-row">
          <div className="hidden 2xl:grid grid-flow-col grid-rows-2 gap-4">
            {mockedData.slice(0, 3).map((place, index) => {
              const isFirst = index === 0;

              return (
                <PlaceCard
                  key={place.name + index}
                  location={`${place.city}, ${place.state}`}
                  name={place.name}
                  image={place.images[0] || '/placeholder.svg'}
                  className={sanitizeClassName(isFirst && 'col-span-2')}
                />
              );
            })}
          </div>

          <div className="2xl:hidden grid grid-flow-col grid-cols-4 grid-rows-2 gap-4">
            {mockedData.map((place, index) => {
              return (
                <PlaceCard
                  key={place.name + index}
                  location={`${place.city}, ${place.state}`}
                  name={place.name}
                  image={place.images[0] || '/placeholder.svg'}
                  className="col-span-2"
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

const mockedData: FindAllPlacesOutput[] = [
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
];

type PlaceCardProps = {
  name: string;
  location: string;
  image: string;
  className?: string;
};

function PlaceCard({ name, location, image, className }: PlaceCardProps) {
  return (
    <div
      className={sanitizeClassName(
        `group
    overflow-hidden
    rounded-xl
    dark:bg-white/5
    backdrop-blur-sm
    border
    transition-all
    duration-300
    hover:border-foreground/50
    hover:shadow-lg`,
        className,
      )}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image || '/placeholder.svg'}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center mt-2 text-muted-foreground">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
      </div>
    </div>
  );
}
