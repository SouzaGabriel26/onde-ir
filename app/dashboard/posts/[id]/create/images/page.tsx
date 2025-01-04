import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { constants } from '@/utils/constants';
import { feedbackMessage } from '@/utils/feedbackMessage';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ImageUpload } from '../../../_components/ImageUpload';
import {
  createPlaceImagesAction,
  getUncompletedPlaceCreatedAction,
} from '../../../create/action/store';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: Props) {
  const { id } = await props.params;

  const uncompletedPlaceCreated = await getUncompletedPlaceCreatedAction();

  const placeDataSource = createPlaceDataSource();

  const { data: placeFound } = await place.findById(placeDataSource, id);

  if (!placeFound) {
    return redirect('/dashboard/posts');
  }

  return (
    <form className="space-y-4">
      <div className="flex gap-2 items-center">
        <h1 className="text-xl">Adicionar imagens ao local:</h1>
        <h2>{placeFound.name}</h2>
      </div>

      <ImageUpload
        successRedirectPath={`/dashboard/posts/${id}`}
        actionOnUpload={async (urls: string[]) => {
          'use server';

          await createPlaceImagesAction({
            place_id: id,
            urls,
            description: `Imagem do local: ${uncompletedPlaceCreated?.name}, ${uncompletedPlaceCreated?.country} - ${uncompletedPlaceCreated?.state}`,
          });

          (await cookies()).delete(constants.uncompletedPlaceCreatedKey);

          await feedbackMessage.setFeedbackMessage({
            content: 'Imagen(s) adicionada(s) com sucesso!',
            type: 'success',
          });
        }}
      />
    </form>
  );
}
