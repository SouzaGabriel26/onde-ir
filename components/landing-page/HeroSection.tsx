import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { PlaceCard } from './PlaceCard';

export function HeroSection() {
  return (
    <main
      className={`
      mt-5
      flex
      flex-1
      flex-col
      items-center
      justify-between
      gap-6
      xl:flex-row
      pt-2
      p-4
    `}
    >
      <section
        className={`
        flex
        flex-col
        items-center
        xl:items-start
        justify-center
        flex-1
        gap-4
        text-center
        xl:text-start
      `}
      >
        <h2
          className={`
          w-fit
          text-5xl
          font-semibold
          leading-tight
        `}
        >
          Viva uma grande
          <br />
          <span className="text-primary"> experiência</span>
        </h2>

        <p className="max-w-64 text-muted-foreground lg:max-w-full lg:text-lg">
          Descubra locais incríveis para se visitar em cidades maravilhosas.
        </p>

        <div className="flex flex-col md:flex-row items-center w-full gap-4">
          <Link href="/dashboard">
            <Button className="flex items-center gap-2" size="lg">
              Descobrir todos lugares
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/dashboard/posts/create">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
            >
              Compartilhar experiência
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-4 lg:flex-row rounded-xl w-full relative xl:h-[700px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 -z-10 to-purple-500/50 rounded-2xl blur-xl opacity-50 w-1/2 mx-auto xl:w-full" />
        <div className="grid grid-cols-1 xl:grid-cols-2 auto-rows-fr h-full gap-2 md:gap-1.5 w-full sm:w-1/2 mx-auto xl:w-full p-2 md:p-1.5 bg-background rounded-xl">
          {mockedData.map((place, index) => {
            const isFirst = index === 0;

            return (
              <PlaceCard
                key={place.name + index}
                name={place.name}
                image={place.image || '/placeholder.svg'}
                className={sanitizeClassName(
                  isFirst && 'xl:col-span-2 xl:row-span-1',
                )}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}

const mockedData = [
  {
    name: 'Café Bamboo',
    image: '/assets/photo-restaurant-01.jpg',
  },
  {
    name: 'Churrascaria Espeto de Ouro',
    image: '/assets/photo-restaurant-02.jpg',
  },
  {
    name: 'Madero Steak House',
    image: '/assets/photo-restaurant-03.jpg',
  },
];
