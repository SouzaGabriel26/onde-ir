import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { verify } from '@/utils/verify';
import { DashboardContent } from './_components/DashboardContent';

export default async function Page() {
  const { error: userNotAuthenticated, data: user } = await verify.loggedUser();

  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      status: 'APPROVED',
    },
  });

  const { data: categories } = await place.findCategories(placeDataSource, {
    where: { is_active: true },
  });

  return (
    <DashboardContent
      categories={categories}
      places={places}
      userId={user?.id ?? ''}
      userNotAuthenticated={!!userNotAuthenticated}
    />
  );
}
