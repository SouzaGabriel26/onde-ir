import Link from 'next/link';

import { ImageCard } from '@/components/ImageCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { verify } from '@/utils/verify';
import { SearchIcon } from 'lucide-react';
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
    <div className="flex h-full flex-col gap-4">
      <form className="flex flex-col md:flex-row gap-4 justify-center items-center md:justify-around">
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

        <fieldset className="flex gap-2">
          <Input placeholder="Qual lugar você procura?" />
          <Button title="pesquisar" className="w-fit px-2">
            <SearchIcon />
          </Button>
        </fieldset>

        <fieldset className="pr-4">
          <nav>
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
              <li className="cursor-pointer">
                <Link
                  href={{
                    href: '/dashboard',
                    query: {
                      type: 'restaurant',
                    },
                  }}
                >
                  Restaurantes
                </Link>
              </li>
              <li className="cursor-pointer">
                <Link
                  href={{
                    href: '/dashboard',
                    query: {
                      type: 'bar',
                    },
                  }}
                >
                  Bares
                </Link>
              </li>
            </ul>
          </nav>
        </fieldset>
      </form>

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
