import { type Category, createPlaceDataSource } from '@/data/place';
import { verify } from '@/utils/verify';

import { CreatePlaceForm } from '@/app/dashboard/posts/_components/CreatePlaceForm';
import { UncompletedPlaceCreation } from '@/app/dashboard/posts/_components/UncompletedPlaceCreation';
import { getUncompletedPlaceCreatedAction } from '@/app/dashboard/posts/actions';
import type { Option } from '@/components/CustomSelect';
import { location } from '@/models/location';
import { place } from '@/models/place';
import { RedirectType, redirect } from 'next/navigation';

export default async function Page() {
  const { error: userNotAuthenticated } = await verify.loggedUser();

  if (userNotAuthenticated) {
    return redirect(
      '/auth/signin?redirect_reason=not-authenticated',
      RedirectType.replace,
    );
  }

  const { data: userData } = await verify.loggedUser();
  const { data: states } = await location.getStates();

  const uncompletedPlaceCreated = await getUncompletedPlaceCreatedAction();

  const stateOptions = states.map<Option>((state) => ({
    label: state.nome,
    value: state.id,
  }));

  const placeDataSource = createPlaceDataSource();
  const { data: categories } = await place.findCategories(placeDataSource, {
    where: { is_active: true },
  });

  const activeCategories: Category[] =
    categories?.filter((category) => category.is_active) ?? [];

  if (uncompletedPlaceCreated) {
    return (
      <UncompletedPlaceCreation
        placeId={uncompletedPlaceCreated.id}
        placeName={uncompletedPlaceCreated.name}
      />
    );
  }

  return (
    <div className="flex-1 space-y-4 p-6">
      <CreatePlaceForm
        createdBy={userData?.id}
        stateOptions={stateOptions}
        activeCategories={activeCategories}
      />
    </div>
  );
}
