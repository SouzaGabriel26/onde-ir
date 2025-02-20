import { Badge } from '@/components/ui/Badge';
import {
  type FindAllPlacesOutput,
  type PlaceStatus,
  createPlaceDataSource,
} from '@/data/place';
import { createUserDataSource } from '@/data/user';
import { user } from '@/models/user';
import { sanitizeClassName } from '@/utils/sanitizeClassName';
import { MapPin } from 'lucide-react';
import { TextInfo } from './TextInfo';

export async function PlaceDetails({ place }: { place: FindAllPlacesOutput }) {
  const placeDataSource = createPlaceDataSource();
  const userDataSource = createUserDataSource();

  const categories = await placeDataSource.findCategories();
  const postCategory = categories.find(
    (category) => category.id === place.category_id,
  );

  const { data: reviewedBy } = await user.findById(userDataSource, {
    id: place.reviewed_by!,
    select: ['name'],
  });

  const { data: postOwner } = await user.findById(userDataSource, {
    id: place.created_by,
    select: ['name', 'id'],
  });

  return (
    <div className="border w-full flex flex-col rounded-md p-4 gap-4">
      <div className="flex justify-between w-full flex-col md:flex-row gap-2">
        <div>
          <h3 className="text-2xl font-bold">{place.name}</h3>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" />
            <span>
              {place.city}, {place.state} - {place.country}
            </span>
          </div>
        </div>

        <PostStatus status={place.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:place-items-center place-items-start">
        <div>
          <TextInfo label="Rua" value={place.street} />

          <TextInfo label="Número" value={String(place.num_place)} />

          <TextInfo label="Complemento" value={place.complement ?? '-'} />

          <TextInfo label="Descrição" value={place.description ?? '-'} />
        </div>

        <div>
          <TextInfo label="Categoria" value={postCategory?.name ?? '-'} />

          {place.status !== 'PENDING' && (
            <TextInfo label="Revisado por" value={reviewedBy?.name ?? '-'} />
          )}

          <TextInfo label="Criado por" value={postOwner?.name ?? '-'} />
        </div>

        <div>
          <TextInfo
            label="Criado em"
            value={new Date(place.created_at).toLocaleDateString()}
          />

          <TextInfo
            label="Atualizado em"
            value={new Date(place.updated_at).toLocaleDateString()}
          />
        </div>
      </div>
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
      className={sanitizeClassName('py-1 h-fit w-fit', StatusStyleEnum[status])}
    >
      {StatusEnum[status]}
    </Badge>
  );
}
