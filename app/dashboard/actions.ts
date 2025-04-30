'use server';

import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';

export async function getPlacesAction(searchTerm: string) {
  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      search_term: searchTerm.toLowerCase(),
      status: 'APPROVED',
    },
  });

  return {
    places: places ?? null,
  };
}

type LoadPlacesActionInput = {
  page: number;
  limit: number;
  status: 'APPROVED' | 'PENDING';
  userId?: string;
  postCategory?: string;
  searchTerm?: string;
};

export async function loadPlacesAction({
  page,
  limit,
  postCategory,
  status,
  userId,
  searchTerm,
}: LoadPlacesActionInput) {
  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    limit,
    page,
    where: {
      status,
      category_name: postCategory,
      created_by: userId,
      search_term: searchTerm ? searchTerm?.toLowerCase() : undefined,
    },
  });

  return {
    places: places ?? [],
  };
}
