import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedComponent } from '../AnimatedComponent';
import { PlaceCard } from '../PlaceCard';
import { Button } from '../ui/Button';

export async function PlacesSection() {
  const placeDataSource = createPlaceDataSource();
  const { data: topFourPlaces } = await place.findAll(placeDataSource, {
    limit: 4,
    rank_by_rating: true,
  });

  return (
    <section className="flex flex-col gap-8 px-4 pb-2">
      <div className="flex justify-between">
        <AnimatedComponent
          variant="h3"
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, delay: 0.2 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          Lugares em destaque
        </AnimatedComponent>

        <Link href="/dashboard">
          <Button asChild variant="ghost">
            <AnimatedComponent
              className="flex items-center justify-center gap-1"
              variant="button"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5, delay: 0.2 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              Ver todos
              <ChevronRight className="size-4" />
            </AnimatedComponent>
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full place-items-center">
        {topFourPlaces?.map((place, index) => (
          <AnimatedComponent
            key={place.id}
            variant="div"
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, delay: index * 0.2 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            <PlaceCard tipDisabled place={place} />
          </AnimatedComponent>
        ))}
      </div>
    </section>
  );
}
