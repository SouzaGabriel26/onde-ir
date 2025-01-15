import { createPlaceDataSource } from '@/data/place';
import { place } from '@/models/place';
import { verify } from '@/utils/verify';
import { DashboardContent } from './_components/DashboardContent';

type Props = {
  searchParams: Promise<{
    type?: string;
    status?: 'PENDING';
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { type, status } = await searchParams;

  const { error: userNotAuthenticated, data: user } = await verify.loggedUser();

  const userAuthenticated = !!user?.id;
  const userIsRequestingPendingPosts =
    userAuthenticated && status === 'PENDING';

  const placeDataSource = createPlaceDataSource();
  const { data: places } = await place.findAll(placeDataSource, {
    where: {
      status: userIsRequestingPendingPosts ? 'PENDING' : 'APPROVED',
      categoryName: type === 'all' ? undefined : type,
      createdBy: userIsRequestingPendingPosts ? user.id : undefined,
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
