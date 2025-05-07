'use server';

import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { env } from '@/utils/env';
import { sleep } from '@/utils/sleep';
import type { FilterByOptionValues } from './_components/FilterBy';

type GetPlacesActionInput = {
  searchTerm?: string;
  rankBy?: FilterByOptionValues;
};

export async function getPlacesAction(input: GetPlacesActionInput) {
  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    rank_by_rating: input.rankBy === 'rating',
    rank_by_comments: input.rankBy === 'comments',
    where: {
      search_term: input.searchTerm?.toLowerCase(),
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
  rankBy?: FilterByOptionValues;
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
  rankBy,
}: LoadPlacesActionInput) {
  if (env.NODE_ENV !== 'production') await sleep();

  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    limit,
    page,
    rank_by_rating: rankBy === 'rating',
    rank_by_comments: rankBy === 'comments',
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
