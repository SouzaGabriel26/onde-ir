import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/Carousel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { type PlaceStatus, createPlaceDataSource } from '@/data/place';
import { createUserDataSource } from '@/data/user';
import { place } from '@/models/place';
import { user } from '@/models/user';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';
import { ExpandIcon, MapPin } from 'lucide-react';
import Image from 'next/image';
import { RedirectType, redirect } from 'next/navigation';
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

  const categories = await placeDataSource.findCategories();
  const postCategory = categories.find(
    (category) => category.id === postFound.category_id,
  );

  const userDataSource = createUserDataSource();

  const { data: reviewedBy } = await user.findById(userDataSource, {
    id: postFound.reviewed_by!,
    select: ['name'],
  });

  const { data: postOwner } = await user.findById(userDataSource, {
    id: postFound.created_by,
    select: ['name', 'id'],
  });

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

      <div className="border w-full flex flex-col rounded-md p-4 gap-4">
        <div className="flex justify-between w-full flex-col md:flex-row gap-2">
          <div>
            <h3 className="text-2xl font-bold">{postFound.name}</h3>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              <span>
                {postFound.city}, {postFound.state} - {postFound.country}
              </span>
            </div>
          </div>

          <PostStatus status={postFound.status} />
        </div>

        <div className="grid gap-6 md:grid-cols-3 place-items-center">
          <div>
            <TextInfo label="Rua" value={postFound.street} />

            <TextInfo label="Número" value={String(postFound.num_place)} />

            <TextInfo label="Complemento" value={postFound.complement ?? '-'} />

            <TextInfo label="Descrição" value={postFound.description ?? '-'} />
          </div>

          <div>
            <TextInfo label="Categoria" value={postCategory?.name ?? '-'} />

            {postFound.status !== 'PENDING' && (
              <TextInfo label="Revisado por" value={reviewedBy?.name ?? '-'} />
            )}

            <TextInfo label="Criado por" value={postOwner?.name ?? '-'} />
          </div>

          <div>
            <TextInfo
              label="Criado em"
              value={new Date(postFound.created_at).toLocaleDateString()}
            />

            <TextInfo
              label="Atualizado em"
              value={new Date(postFound.updated_at).toLocaleDateString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500">{label} </span>
      <span>{value}</span>
    </div>
  );
}

function PostStatus({ status }: { status: PlaceStatus }) {
  const StatusEnum = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Rejeitado',
  };

  const StatusStyleEnum = {
    PENDING: 'text-yellow-500',
    APPROVED: 'text-green-500',
    REJECTED: 'text-red-500',
  };

  return (
    <Badge
      variant="outline"
      className={sanitizeClassName('py-1 h-fit', StatusStyleEnum[status])}
    >
      {StatusEnum[status]}
    </Badge>
  );
}
