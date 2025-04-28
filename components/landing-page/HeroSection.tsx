import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedComponent } from '../AnimatedComponent';
import { Button } from '../ui/Button';
import { PlaceCard } from './PlaceCard';

export function HeroSection() {
  return (
    <main
      className={`
        mt-5
        flex
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
        <AnimatedComponent
          variant="h2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
        </AnimatedComponent>

        <AnimatedComponent
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: -5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          variant="p"
          className="max-w-64 text-muted-foreground lg:max-w-full lg:text-lg"
        >
          Descubra locais incríveis para se visitar em cidades maravilhosas.
        </AnimatedComponent>

        <div className="flex flex-col md:flex-row items-center w-full gap-4">
          <Link href="/dashboard">
            <Button asChild className="flex items-center gap-2" size="lg">
              <AnimatedComponent
                variant="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, delay: 0.6 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                Descobrir todos lugares
                <ChevronRight className="w-4 h-4" />
              </AnimatedComponent>
            </Button>
          </Link>

          <Link href="/dashboard/posts/create">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              size="lg"
              asChild
            >
              <AnimatedComponent
                variant="button"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.5, delay: 0.8 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                Compartilhar experiência
                <ChevronRight className="w-4 h-4" />
              </AnimatedComponent>
            </Button>
          </Link>
        </div>
      </section>

      <section className="hidden xl:flex flex-1 flex-col gap-4 lg:flex-row rounded-xl w-[90%] relative h-[600px]">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 -z-10 to-purple-500/50 rounded-xl blur-xl opacity-50 mx-auto w-full" />
        <div className="grid grid-cols-2 auto-rows-fr h-full gap-1.5 w-full p-1 md:p-1.5 bg-background rounded-xl">
          {mockedData.map((place, index) => {
            const isFirst = index === 0;

            return (
              <PlaceCard
                index={index}
                key={place.name + index}
                name={place.name}
                image={place.image || '/placeholder.svg'}
                className={sanitizeClassName(
                  'rounded-[calc(var(--radius)-4px)]',
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
