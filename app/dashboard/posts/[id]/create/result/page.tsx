import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
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
    <div className="flex items-center justify-center rounded-md py-10">
      <div className="max-w-2xl w-full shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-6">
          Parabéns! Seu post foi criado com sucesso.
        </h1>

        <div className="space-y-4">
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clique para ver mais informações sobre o seu post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
