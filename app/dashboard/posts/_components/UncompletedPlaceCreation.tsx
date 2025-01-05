'use client';

import { Button } from '@/components/ui/Button';
import { redirect } from 'next/navigation';
import { dismissUncompletedPlaceCreationAction } from '../actions';

export type UncompletedPlaceCreationProps = {
  placeId: string;
  placeName: string;
};

export function UncompletedPlaceCreation({
  placeId,
  placeName,
}: UncompletedPlaceCreationProps) {
  return (
    <div className="h-full w-full flex items-center justify-center flex-col gap-4">
      <p className="text-center">
        Você possui um post incompleto (não cadastrou as imagens): {placeName}
      </p>
      <div className="flex gap-4">
        <Button
          title={`Ignorar post incompleto de ${placeName}`}
          variant="destructive"
          onClick={dismissUncompletedPlaceCreationAction}
        >
          Descartar/Ignorar post incompleto
        </Button>

        <Button
          title={`Cadastrar imagens para ${placeName}`}
          onClick={() => {
            redirect(`/dashboard/posts/${placeId}/create/images`);
          }}
        >
          Cadastrar imagens
        </Button>
      </div>
    </div>
  );
}
