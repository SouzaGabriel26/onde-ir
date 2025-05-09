import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { CheckIcon } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: Props) {
  const { id } = await props.params;

  const placeDataSource = createPlaceDataSource();
  const { data: createdPlace } = await place.findById(placeDataSource, id);

  return (
    <div className="flex items-center justify-center rounded-md">
      <div className="max-w-3xl w-full shadow-md">
        <div className="p-6 bg-gradient-to-r flex flex-col justify-center items-center gap-3 from-green-500 to-emerald-600 rounded-t-md">
          <span className="bg-white/20 rounded-full p-2">
            <CheckIcon className="w-6 h-" />
          </span>

          <h1 className="text-2xl font-bold text-center">
            Parabéns! Seu post foi criado com sucesso.
          </h1>
        </div>

        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">
            Informações sobre o lugar recentemente criado:
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block font-medium">Nome:</span>
              <span className="block">{createdPlace?.name}</span>
            </div>

            <div>
              <span className="block font-medium">País:</span>
              <span className="block">{createdPlace?.country}</span>
            </div>

            <div>
              <span className="block font-medium">Estado:</span>
              <span className="block">{createdPlace?.state}</span>
            </div>

            <div>
              <span className="block font-medium">Cidade:</span>
              <span className="block">{createdPlace?.city}</span>
            </div>
          </div>

          {createdPlace?.status === 'PENDING' && (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
              Seu post está aguardando aprovação.
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href={`/dashboard/posts/${id}`}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clique para ver mais informações sobre o seu post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
