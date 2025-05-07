'use client';

import { AnimatedComponent } from '@/components/AnimatedComponent';
import { DebouncedInput } from '@/components/DebouncedInput';
import { PlaceCard } from '@/components/PlaceCard';
import { PlaceListItem } from '@/components/PlaceListItem';
import { Button } from '@/components/ui/Button';
import type { Category, FindAllPlacesOutput } from '@/data/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { Loader2Icon } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChangeVisualizationType } from '../ChangeVisualizationType';
import { FilterBy } from '../FilterBy';
import { PlacesFilters } from '../PlacesFilters';
import { useDashboardContent } from './useDashboardContent';

type PlacesListProps = {
  places: FindAllPlacesOutput[] | null;
  categories: Category[];
  userId: string;
  userNotAuthenticated: boolean;
  userIsRequestingPendingPosts: boolean;
  adminIsRequestingPendingPosts: boolean;
};

const PER_PAGE = 10;

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

  const {
    isLoadingFilter,
    isLoadingMorePlaces,
    visualizationType,
    filteredPlaces,
    selectedFilterBy,
    handleSearch,
    loadMorePlacesRef,
    handleChangeFilterBy,
    handleChangeVisualizationType,
  } = useDashboardContent({
    userId,
    places,
    perPage: PER_PAGE,
    postCategory,
    userIsRequestingPendingPosts,
    adminIsRequestingPendingPosts,
  });

  return (
    <div className="flex h-full flex-col gap-4 w-full px-1">
      <form className="flex flex-col md:flex-row gap-4 justify-center items-center md:justify-between">
        <div className="flex gap-4 flex-col md:flex-row">
          <fieldset className="flex gap-2 justify-center md:justify-start items-center relative">
            <DebouncedInput
              className="w-full"
              onDebounce={handleSearch}
              placeholder="Qual lugar você procura?"
            />

            {isLoadingFilter && (
              <Loader2Icon className="size-4 animate-spin absolute top-2.5 right-2.5" />
            )}
          </fieldset>

          <PlacesFilters categories={categories} />
        </div>

        <div className="flex gap-4 items-center flex-row">
          <FilterBy
            selectedValue={selectedFilterBy}
            onChange={handleChangeFilterBy}
          />

          <ChangeVisualizationType
            onChangeVisualizationType={handleChangeVisualizationType}
            visualizationType={visualizationType}
          />
        </div>
      </form>

      <div className="flex items-center flex-col gap-2 md:flex-row justify-center md:justify-start">
        <Link
          href={
            userNotAuthenticated
              ? '/auth/signin?redirect_reason=not-authenticated'
              : '/dashboard/posts/create'
          }
        >
          <Button className="text-xs md:text-base">
            {userNotAuthenticated
              ? 'Faça login para criar uma postagem'
              : 'Crie sua postagem'}
          </Button>
        </Link>

        {userId && (
          <Link
            className={status === 'user-pendings' ? 'pointer-events-none' : ''}
            href={{
              href: '/dashboard/',
              query: {
                status: 'user-pendings',
              },
            }}
          >
            <Button
              disabled={status === 'user-pendings'}
              className="text-xs md:text-base"
            >
              Ver seus posts pendentes
            </Button>
          </Link>
        )}
      </div>

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
          className={sanitizeClassName(
            `
            grid-cols-1
            md:grid-cols-2
            2xl:grid-cols-3
            rounded-[20px]
            gap-10
            overflow-y-auto
            scrollbar
            pb-16
            pt-4
            justify-items-center
            items-center
            w-full
          `,
            visualizationType === 'grid' ? 'grid' : 'flex flex-col gap-3',
          )}
        >
          {filteredPlaces?.map((place, index) => {
            const isPostOwner = place.created_by === userId;
            const animationDelay = (index % PER_PAGE) * 0.1;

            return (
              <AnimatedComponent
                key={place.id}
                variant="div"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: animationDelay },
                }}
              >
                {visualizationType === 'grid' ? (
                  <PlaceCard
                    href={`/dashboard/posts/${place.id}` as Route}
                    isOwner={isPostOwner}
                    place={place}
                  />
                ) : (
                  <PlaceListItem
                    href={`/dashboard/posts/${place.id}` as Route}
                    isOwner={isPostOwner}
                    place={place}
                  />
                )}
              </AnimatedComponent>
            );
          })}

          <div
            className="grid w-full place-items-center"
            ref={loadMorePlacesRef}
          >
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
