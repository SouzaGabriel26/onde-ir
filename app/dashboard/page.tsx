import Link from 'next/link';

import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';
import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { verify } from '@/utils/verify';
import type { Route } from 'next';

export default async function Page() {
  const { error: userNotAuthenticated, data: user } = await verify.loggedUser();

  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      status: 'APPROVED',
    },
  });

  return (
    <div className="flex h-full flex-col gap-2">
      <Link
        className="self-end"
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
      <section
        className={`
          grid
          flex-1
          grid-cols-1
          place-items-center
          gap-3
          overflow-y-auto
          sm:grid-cols-2
          md:grid-cols-3
          2xl:grid-cols-5
        `}
      >
        {places?.map((place) => {
          const isPostOwner = place.created_by === user?.id;

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
    </div>
  );
}
