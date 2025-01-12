import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { verify } from '@/utils/verify';
import { DashboardContent } from './_components/DashboardContent';

type Props = {
  searchParams: Promise<{
    type: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { type } = await searchParams;

  const { error: userNotAuthenticated, data: user } = await verify.loggedUser();

  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      status: 'APPROVED',
      categoryName: type === 'all' ? undefined : type,
    },
  });

  const { data: categories } = await place.findCategories(placeDataSource, {
    where: { is_active: true },
  });

  return (
    <DashboardContent
      key={Date.now()}
      categories={categories}
      places={places}
      userId={user?.id ?? ''}
      userNotAuthenticated={!!userNotAuthenticated}
    />
  );
}
