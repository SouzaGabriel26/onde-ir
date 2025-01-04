import { type Category, createPlaceDataSource } from '@/data/place';
import { verify } from '@/utils/verify';

import type { Option } from '@/components/CustomSelect';
import { location } from '@/models/location';
import { CreatePlaceForm } from '../_components/CreatePlaceForm';
import { UncompletedPlaceCreation } from '../_components/UncompletedPlaceCreation';
import { getUncompletedPlaceCreatedAction } from './action/store';

export default async function Page() {
  const { data: userData } = await verify.loggedUser();
  const { data: states } = await location.getStates();

  const uncompletedPlaceCreated = await getUncompletedPlaceCreatedAction();

  const stateOptions = states.map<Option>((state) => ({
    label: state.nome,
    value: state.id,
  }));

  const placeDataSource = createPlaceDataSource();
  // TODO: refactor `findCategories`
  const categories = await placeDataSource.findCategories();
  const activeCategories: Category[] = categories.filter(
    (category) => category.is_active,
  );

  if (uncompletedPlaceCreated) {
    return (
      <UncompletedPlaceCreation
        placeId={uncompletedPlaceCreated.id}
        placeName={uncompletedPlaceCreated.name}
      />
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <CreatePlaceForm
        createdBy={userData?.id}
        stateOptions={stateOptions}
        activeCategories={activeCategories}
      />
    </div>
  );
}
