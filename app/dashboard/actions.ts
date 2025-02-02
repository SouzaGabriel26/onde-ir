'use server';

import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';

export async function getPlacesAction(searchTerm: string) {
  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      searchTerm: searchTerm.toLowerCase(),
      status: 'APPROVED',
    },
  });

  return {
    places: places ?? null,
  };
}

type loadPlacesActionInput = {
  page: number;
  limit: number;
  postCategory?: string;
};

export async function loadPlacesAction({
  page,
  limit,
  postCategory,
}: loadPlacesActionInput) {
  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    limit,
    page,
    where: {
      status: 'APPROVED',
      categoryName: postCategory,
    },
  });

  return {
    places: places ?? [],
  };
}
