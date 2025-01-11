'use client';

import { DebouncedInput } from '@/components/DebouncedInput';
import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';
import type { Category, FindAllPlacesOutput } from '@/data/place';
import { Loader2Icon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { getPlacesAction } from '../actions';

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
    <div className="flex h-full flex-col gap-4">
      <form className="px-6 flex flex-col md:flex-row gap-4 justify-center items-center md:justify-between">
        <fieldset className="flex gap-2 w-full justify-center md:justify-start items-center">
          <DebouncedInput
            className="w-full"
            onDebounce={handleSearch}
            placeholder="Qual lugar você procura?"
          />

          {isLoading && <Loader2Icon className="size-6 animate-spin" />}
        </fieldset>

        <Link
          href={
            userNotAuthenticated
              ? '/auth/signin?redirect_reason=not-authenticated'
              : '/dashboard/posts/create'
          }
        >
          <Button variant="secondary">
            {userNotAuthenticated
              ? 'Faça login para criar uma postagem'
              : 'Crie sua postagem'}
          </Button>
        </Link>
      </form>

      <nav className="flex justify-center">
        <ul className="flex gap-4">
          <li className="cursor-pointer">
            <Link
              href={{
                href: '/dashboard/',
                query: {
                  type: 'all',
                },
              }}
              className="border-b-2 border-primary"
            >
              Todos
            </Link>
          </li>
          {categories.map(({ id, name }) => (
            <li key={id} className="cursor-pointer">
              <Link
                href={{
                  href: '/dashboard/',
                  query: {
                    type: name,
                  },
                }}
                className="capitalize"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

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
