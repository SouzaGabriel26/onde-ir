import { Button } from '@/components/ui/Button';
import { type PlaceStatus, createPlaceDataSource } from '@/data/place';
import { createUserDataSource } from '@/data/user';
import { place } from '@/models/place';
import { user } from '@/models/user';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { verify } from '@/utils/verify';
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          placeItems: 'center',
          gap: '1rem',
        }}
      >
        {postFound.images.map((url, index) => (
          <div
            key={`foto-${postFound.name}-${index}`}
            className={sanitizeClassName(
              'relative',
              'h-44 w-64 md:h-64 md:w-96',
            )}
          >
            <Image
              fill
              src={url}
              alt={`Foto ${index + 1} de ${postFound.name}`}
              sizes="100%"
              className="rounded-[20px] object-cover"
            />
          </div>
        ))}
      </div>

      <div className="md:w-fit md:mx-auto">
        <h2 className="text-3xl md:text-center mb-2">Sobre o local:</h2>

        <TextInfo label="Nome" value={postFound.name} />

        <TextInfo label="País" value={postFound.country} />

        <TextInfo label="Estado" value={postFound.state} />

        <TextInfo label="Cidade" value={postFound.city} />

        <TextInfo label="Rua" value={postFound.street} />

        <TextInfo label="Número" value={String(postFound.num_place)} />

        <TextInfo label="Complemento" value={postFound.complement ?? '-'} />

        <TextInfo label="Descrição" value={postFound.description ?? '-'} />

        <TextInfo label="Categoria" value={postCategory?.name ?? '-'} />

        <PostStatus status={postFound.status} />

        {postFound.status !== 'PENDING' && (
          <TextInfo label="Revisado por" value={reviewedBy?.name ?? '-'} />
        )}

        <TextInfo
          label="Criado em"
          value={new Date(postFound.created_at).toLocaleDateString()}
        />

        <TextInfo label="Criado por" value={postOwner?.name ?? '-'} />

        <TextInfo
          label="Atualizado em"
          value={new Date(postFound.updated_at).toLocaleDateString()}
        />
      </div>
    </div>
  );
}

function TextInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex space-x-2">
      <span className="text-slate-500">{label}: </span>
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
    <div className="flex space-x-2">
      <span className="text-slate-500">Status: </span>
      <span className={StatusStyleEnum[status]}>{StatusEnum[status]}</span>
    </div>
  );
}
