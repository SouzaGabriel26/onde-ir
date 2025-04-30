'use client';

import { AnimatedComponent } from '@/components/AnimatedComponent';
import { DebouncedInput } from '@/components/DebouncedInput';
import { PlaceCard } from '@/components/PlaceCard';
import { Button } from '@/components/ui/Button';
import type { Category, FindAllPlacesOutput } from '@/data/place';
import { Loader2Icon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPlacesAction, loadPlacesAction } from '../actions';
import { PlacesFilters } from './PlacesFilters';

type PlacesListProps = {
  places: FindAllPlacesOutput[] | null;
  categories: Category[];
  userId: string;
  userNotAuthenticated: boolean;
  userIsRequestingPendingPosts: boolean;
  adminIsRequestingPendingPosts: boolean;
};

export function DashboardContent({
  places,
  categories,
  userId,
  userNotAuthenticated,
  userIsRequestingPendingPosts,
  adminIsRequestingPendingPosts,
}: PlacesListProps) {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const postCategory = searchParams.get('type');

  const { ref, inView } = useInView();

  const [filteredPlaces, setFilteredPlaces] = useState<
    FindAllPlacesOutput[] | null
  >(places);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMorePlaces, setIsLoadingPlaces] = useState(false);
  const [isToFetchMorePlaces, setIsToFetchMorePlaces] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [page, setPage] = useState(1);

  async function handleSearch(value: string) {
    setIsLoading(true);
    setDebouncedSearch(value);

    if (!value) {
      setPage(1);
      setFilteredPlaces(places);
      setIsLoading(false);
      return;
    }

    const { places: filteredPlaces } = await getPlacesAction(value);

    setFilteredPlaces(filteredPlaces);
    setIsLoading(false);
  }

  const loadMorePlaces = useCallback(async () => {
    setIsLoadingPlaces(true);
    const nextPage = page + 1;

    setTimeout(async () => {
      const { places: newPlaces } = await loadPlacesAction({
        page: nextPage,
        limit: 10,
        postCategory: postCategory ?? undefined,
        status:
          userIsRequestingPendingPosts || adminIsRequestingPendingPosts
            ? 'PENDING'
            : 'APPROVED',
        userId: userIsRequestingPendingPosts ? userId : undefined,
        searchTerm: debouncedSearch ? debouncedSearch.toLowerCase() : undefined,
      });

      if (newPlaces.length === 0) {
        setIsToFetchMorePlaces(false);
        setIsLoadingPlaces(false);
        return;
      }

      setPage(nextPage);
      setFilteredPlaces((prev) => [...(prev ?? []), ...newPlaces]);
      setIsLoadingPlaces(false);
    }, 500);
  }, [
    page,
    postCategory,
    debouncedSearch,
    userIsRequestingPendingPosts,
    adminIsRequestingPendingPosts,
    userId,
  ]);

  useEffect(() => {
    if (inView && isToFetchMorePlaces) {
      loadMorePlaces();
    }

    if (!inView) {
      setIsToFetchMorePlaces(true);
    }
  }, [inView, loadMorePlaces, isToFetchMorePlaces]);

  return (
    <div className="flex h-full flex-col gap-4 w-full px-1">
      <form className="flex flex-col md:flex-row gap-4 justify-center items-center md:justify-between">
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
            <Button variant="outline" className="text-xs md:text-base">
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
                variant="outline"
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
            grid
            grid-cols-1
            lg:grid-cols-2
            2xl:grid-cols-3
            rounded-[20px]
            gap-10
            overflow-y-auto
            scrollbar
            pb-16
            px-4
            pt-4
            justify-items-center
            items-center
            w-full
          `}
        >
          {filteredPlaces?.map((place, index) => {
            const isPostOwner = place.created_by === userId;

            return (
              <AnimatedComponent
                key={place.id}
                variant="div"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.1 },
                }}
              >
                <PlaceCard
                  href={`/dashboard/posts/${place.id}` as Route}
                  key={place.id}
                  isOwner={isPostOwner}
                  place={place}
                />
              </AnimatedComponent>
            );
          })}

          <div className="grid w-full place-items-center" ref={ref}>
            <div className="flex gap-2 text-muted-foreground">
              {isLoadingMorePlaces && (
                <>
                  Carregando mais lugares...
                  <Loader2Icon className="size-6 animate-spin" />
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
