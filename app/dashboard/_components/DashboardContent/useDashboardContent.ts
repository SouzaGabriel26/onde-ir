import type { FindAllPlacesOutput } from '@/data/place';
import { useVisualizationType } from '@/hooks/useVisualizationType';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { getPlacesAction, loadPlacesAction } from '../../actions';
import type { FilterByOptionValues } from '../FilterBy';

type UseDashboardContentProps = {
  places: FindAllPlacesOutput[] | null;
  userIsRequestingPendingPosts: boolean;
  adminIsRequestingPendingPosts: boolean;
  perPage: number;
  postCategory: string | null;
  userId: string;
};

export function useDashboardContent({
  places,
  userIsRequestingPendingPosts,
  adminIsRequestingPendingPosts,
  perPage,
  postCategory,
  userId,
}: UseDashboardContentProps) {
  const [page, setPage] = useState(1);

  // Loading
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isLoadingMorePlaces, setIsLoadingMorePlaces] = useState(false);

  // Places
  const [isToFetchMorePlaces, setIsToFetchMorePlaces] = useState(true);
  const [filteredPlaces, setFilteredPlaces] = useState<
    FindAllPlacesOutput[] | null
  >(places);

  // Search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedFilterBy, setSelectedFilterBy] =
    useState<FilterByOptionValues>('recent');

  async function handleSearch(value: string) {
    setIsLoadingFilter(true);
    setDebouncedSearch(value);

    if (!value) {
      startTransition(() => {
        setPage(1);
      });
    }

    const { places: filteredPlaces } = await getPlacesAction({
      searchTerm: value ? value.toLowerCase() : undefined,
      rankBy: selectedFilterBy,
    });

    setFilteredPlaces(filteredPlaces);
    setIsLoadingFilter(false);
  }

  async function handleChangeFilterBy(value: FilterByOptionValues) {
    setIsLoadingFilter(true);
    setSelectedFilterBy(value);

    const { places: filteredPlaces } = await getPlacesAction({
      searchTerm: debouncedSearch ? debouncedSearch : undefined,
      rankBy: value,
    });

    setFilteredPlaces(filteredPlaces);
    setIsLoadingFilter(false);
  }

  const loadMorePlaces = useCallback(async () => {
    if (!isToFetchMorePlaces) {
      return;
    }

    setIsLoadingMorePlaces(true);
    const nextPage = page + 1;

    const { places: newPlaces } = await loadPlacesAction({
      page: nextPage,
      limit: perPage,
      postCategory: postCategory ?? undefined,
      status:
        userIsRequestingPendingPosts || adminIsRequestingPendingPosts
          ? 'PENDING'
          : 'APPROVED',
      userId: userIsRequestingPendingPosts ? userId : undefined,
      searchTerm: debouncedSearch ? debouncedSearch.toLowerCase() : undefined,
      rankBy: selectedFilterBy,
    });

    const newUniquePlaces = newPlaces.filter(
      (newPlaces) =>
        !filteredPlaces?.some((place) => place.id === newPlaces.id),
    );
    setFilteredPlaces((prev) => [...(prev ?? []), ...newUniquePlaces]);
    setPage(nextPage);

    if (newPlaces.length < perPage) {
      setIsToFetchMorePlaces(false);
      setIsLoadingMorePlaces(false);
      return;
    }

    setIsLoadingMorePlaces(false);
  }, [
    page,
    postCategory,
    debouncedSearch,
    userIsRequestingPendingPosts,
    adminIsRequestingPendingPosts,
    userId,
    filteredPlaces,
    isToFetchMorePlaces,
    selectedFilterBy,
    perPage,
  ]);

  const { ref: loadMorePlacesRef, inView: isInView } = useInView();

  const { visualizationType, handleChangeVisualizationType } =
    useVisualizationType();

  useEffect(() => {
    if (isInView) {
      loadMorePlaces();
    }

    if (!isInView) {
      setIsToFetchMorePlaces(true);
    }
  }, [isInView, loadMorePlaces]);

  return {
    loadMorePlacesRef,
    isLoadingFilter,
    isLoadingMorePlaces,
    filteredPlaces,
    visualizationType,
    selectedFilterBy,
    handleSearch,
    handleChangeFilterBy,
    handleChangeVisualizationType,
  };
}
