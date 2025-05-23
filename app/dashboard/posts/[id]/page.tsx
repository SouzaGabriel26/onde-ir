import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/Carousel';
import { RatingModal } from '@/components/RatingModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';
import Image from 'next/image';
import { RedirectType, redirect } from 'next/navigation';
import { PlaceComments } from './_components/PlaceComments';
import { PlaceDetails } from './_components/PlaceDetails';
import {
  approvePlaceAction,
  ratePlaceAction,
  rejectPlaceAction,
} from './actions';

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
  const { data: userAlreadyEvaluated } = await place.findUserRating(
    placeDataSource,
    {
      placeId: postId,
      userId: loggedUser?.id ?? '',
    },
  );

  return (
    <div className="w-full space-y-6 p-6 pb-14">
      {loggedUser && !userAlreadyEvaluated && (
        <RatingModal
          key={Date.now()}
          placeId={postId}
          userId={loggedUser?.id ?? ''}
          action={ratePlaceAction}
          className="top-2 right-2 absolute"
        />
      )}

      {userAlreadyEvaluated && (
        <div className="w-full flex justify-center">
          <Badge variant="outline">
            Você já avaliou este local com score de{' '}
            {userAlreadyEvaluated.rating}
          </Badge>
        </div>
      )}

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
                  <Image
                    priority
                    fill
                    src={url}
                    alt={`Foto ${index + 1} de ${postFound.name}`}
                    sizes="100%"
                    className="rounded-[20px] object-contain"
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
        placeId={postId}
      />
    </div>
  );
}
