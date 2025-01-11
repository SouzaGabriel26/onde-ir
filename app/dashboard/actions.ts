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
