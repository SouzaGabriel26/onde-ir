'use client';

import type { FindAllPlacesOutput } from '@/data/place';
import { AlertCircle, CheckIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPlaceById } from './actions';

type SuccessFeedbackProps = {
  placeId: string;
};

export default function SuccessFeedback({ placeId }: SuccessFeedbackProps) {
  const [place, setPlace] = useState<FindAllPlacesOutput>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchPlace();

    async function fetchPlace() {
      const { data: place, error } = await getPlaceById(placeId);

      if (error) {
        setError(true);
      }

      if (place) {
        setPlace(place);
      }

      setIsLoading(false);
    }
  }, [placeId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-md">
        <div className="max-w-3xl w-full shadow-md animate-pulse">
          <div className="p-6 bg-gradient-to-r flex flex-col justify-center items-center gap-3 from-gray-200 to-gray-300 rounded-t-md">
            <div className="bg-gray-300 rounded-full p-2 w-10 h-10" />
            <div className="h-8 bg-gray-300 rounded w-3/4" />
          </div>

          <div className="space-y-4 p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-md">
        <div className="max-w-3xl w-full shadow-md">
          <div className="p-6 bg-gradient-to-r flex flex-col justify-center items-center gap-3 from-red-500 to-red-600 rounded-t-md">
            <span className="bg-white/20 rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-white" />
            </span>
            <h1 className="text-2xl font-bold text-center text-white">
              Ops! Algo deu errado.
            </h1>
          </div>

          <div className="p-6 text-center">
            <p className="mb-6 text-gray-600">
              Não foi possível carregar as informações do seu post. Verifique se
              ele foi criado com sucesso.
            </p>
            <Link
              href="/dashboard?status=user-pendings"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ir para o Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center rounded-md">
      <div className="max-w-3xl w-full shadow-md">
        <div className="p-6 bg-gradient-to-r flex flex-col justify-center items-center gap-3 from-green-500 to-emerald-600 rounded-t-md">
          <span className="bg-white/20 rounded-full p-2">
            <CheckIcon className="w-6 h-6" />
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
              <span className="block">{place?.name}</span>
            </div>

            <div>
              <span className="block font-medium">País:</span>
              <span className="block">{place?.country}</span>
            </div>

            <div>
              <span className="block font-medium">Estado:</span>
              <span className="block">{place?.state}</span>
            </div>

            <div>
              <span className="block font-medium">Cidade:</span>
              <span className="block">{place?.city}</span>
            </div>
          </div>

          {place?.status === 'PENDING' && (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
              Seu post está aguardando aprovação.
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href={`/dashboard/posts/${placeId}`}
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
