'use client';

import { ImageUpload } from '@/app/dashboard/posts/_components/ImageUpload';

type CreatePlaceImagesFormProps = {
  // TODO: add object type created and saved with zustand
  placeBeingCreated: { name: string };
  onSave: () => void;
};

export default function CreatePlaceImagesForm({
  placeBeingCreated,
  onSave,
}: CreatePlaceImagesFormProps) {
  // const uncompletedPlaceCreated = await getUncompletedPlaceCreatedAction();

  return (
    <form className="space-y-4 p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-xl">Adicionar imagens ao local:</h1>
        <h2>{placeBeingCreated.name}</h2>
      </div>

      <ImageUpload
        actionOnUpload={async (_urls: string[]) => {
          'use server';

          // TODO: get the global state (zustant) and provide the current CreatePlaceInput here
          // await createPlacesWithImagesAction({}, urls);
          onSave();
        }}
      />
    </form>
  );
}
