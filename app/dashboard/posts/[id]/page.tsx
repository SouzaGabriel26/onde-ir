import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/Carousel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';
import { ExpandIcon } from 'lucide-react';
import Image from 'next/image';
import { RedirectType, redirect } from 'next/navigation';
import { PlaceComments } from './_components/PlaceComments';
import { PlaceDetails } from './_components/PlaceDetails';
import { approvePlaceAction, rejectPlaceAction } from './actions';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { id: postId } = params;

  const placeDataSource = createPlaceDataSource();
  const { data: loggedUser } = await verify.loggedUser();

  const { data: postFound, error } = await place.findById(
    placeDataSource,
    postId,
  );
  if (error) {
    redirect('/dashboard', RedirectType.replace);
  }

  const isOwner = loggedUser?.id === postFound.created_by;
  const isAdmin = loggedUser?.userRole === 'ADMIN';

  if (postFound.status === 'PENDING') {
    if (!loggedUser || (!isOwner && !isAdmin)) {
      redirect('/dashboard', RedirectType.replace);
    }
  }

  const { data: comments } = await place.findComments(placeDataSource, postId);

  return (
    <div className="w-full space-y-6 pb-2">
      <div className="w-full flex flex-col md:flex-row gap-4 justify-between">
        <h2 className="text-3xl md:text-center">Foto(s) de {postFound.name}</h2>

        {isAdmin && postFound.status === 'PENDING' && (
          <form className="space-x-2">
            <Button
              formAction={async () => {
                'use server';

                await approvePlaceAction({
                  placeId: postFound.id,
                  reviewedBy: loggedUser.id!,
                });
              }}
            >
              Aprovar
            </Button>

            <Button
              variant="destructive"
              formAction={async () => {
                'use server';

                await rejectPlaceAction({
                  placeId: postFound.id,
                  reviewedBy: loggedUser.id!,
                });
              }}
            >
              Rejeitar
            </Button>
          </form>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Carousel className="w-full">
          <CarouselContent>
            {postFound.images.map((url, index) => (
              <CarouselItem
                key={`foto-${postFound.name}-${index}`}
                className="flex justify-center"
              >
                <div
                  className={sanitizeClassName(
                    'relative aspect-video w-full h-full max-h-[600px] max-w-[1300px] rounded-md',
                  )}
                >
                  <Button
                    title="expandir"
                    className="absolute top-2 right-2 z-10"
                    size="sm"
                    variant="secondary"
                  >
                    <ExpandIcon className="size-4" />
                  </Button>

                  <Image
                    priority
                    fill
                    src={url}
                    alt={`Foto ${index + 1} de ${postFound.name}`}
                    sizes="100%"
                    className="rounded-[20px] object-cover"
                  />

                  <Badge
                    variant="secondary"
                    className="absolute bottom-2 right-2"
                  >
                    {index + 1} / {postFound.images.length}
                  </Badge>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      <PlaceDetails place={postFound} />

      <PlaceComments
        comments={comments ?? []}
        isAdmin={isAdmin}
        isPostOwner={isOwner}
        userId={loggedUser?.id ?? ''}
      />
    </div>
  );
}
