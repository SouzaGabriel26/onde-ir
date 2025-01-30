'use client';

import { DebouncedInput } from '@/components/DebouncedInput';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';
import type { Category, FindAllPlacesOutput } from '@/data/place';
import { Loader2Icon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getPlacesAction } from '../actions';
import { PlacesFilters } from './PlacesFilters';

type PlacesListProps = {
  places: FindAllPlacesOutput[] | null;
  categories: Category[];
  userId: string;
  userNotAuthenticated: boolean;
};

export function DashboardContent({
  places,
  categories,
  userId,
  userNotAuthenticated,
}: PlacesListProps) {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const [filteredPlaces, setFilteredPlaces] = useState<
    FindAllPlacesOutput[] | null
  >(places);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(value: string) {
    setIsLoading(true);

    if (!value) {
      setFilteredPlaces(places);
      setIsLoading(false);
      return;
    }

    const { places: filteredPlaces } = await getPlacesAction(value);

    setFilteredPlaces(filteredPlaces);
    setIsLoading(false);
  }

  return (
    <div className="flex h-full flex-col gap-4 w-full">
      <form className="px-6 flex flex-col md:flex-row gap-4 justify-center items-center md:justify-between">
        <fieldset className="flex gap-2 w-full justify-center md:justify-start items-center">
          <DebouncedInput
            className="w-full"
            onDebounce={handleSearch}
            placeholder="Qual lugar você procura?"
          />

          {isLoading && <Loader2Icon className="size-6 animate-spin" />}
        </fieldset>

        <div className="flex gap-4 flex-col items-center md:flex-row">
          <Link
            href={
              userNotAuthenticated
                ? '/auth/signin?redirect_reason=not-authenticated'
                : '/dashboard/posts/create'
            }
          >
            <Button variant="secondary" className="text-xs md:text-base">
              {userNotAuthenticated
                ? 'Faça login para criar uma postagem'
                : 'Crie sua postagem'}
            </Button>
          </Link>

          {userId && (
            <Link
              className={
                status === 'user-pendings' ? 'pointer-events-none' : ''
              }
              href={{
                href: '/dashboard/',
                query: {
                  status: 'user-pendings',
                },
              }}
            >
              <Button
                variant="secondary"
                disabled={status === 'user-pendings'}
                className="text-xs md:text-base"
              >
                Ver seus posts pendentes
              </Button>
            </Link>
          )}
        </div>
      </form>

      <PlacesFilters categories={categories} />

      {status === 'user-pendings' && (
        <Link className="w-fit self-end" href="/dashboard/" as="/dashboard/">
          <Button variant="link" className="text-xs md:text-base">
            Voltar para posts aprovados
          </Button>
        </Link>
      )}

      {!filteredPlaces || !filteredPlaces.length ? (
        <div className="flex flex-1 justify-center items-center">
          Nenhum lugar encontrado.
        </div>
      ) : (
        <section
          className={`
            flex
            rounded-[20px]
            flex-wrap
            justify-center
            gap-10
            md:gap-24
            overflow-y-auto
            scroolbar
            pt-6
            pb-12
          `}
        >
          {filteredPlaces?.map((place) => {
            const isPostOwner = place.created_by === userId;

            return (
              <ImageCard
                href={`/dashboard/posts/${place.id}` as Route}
                key={place.id}
                title={place.name}
                alt={`foto de ${place.name}`}
                src={place.images[0] ?? 'https://via.placeholder.com/300'}
                description={place.description ?? 'sem descrição'}
                isOwner={isPostOwner}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
