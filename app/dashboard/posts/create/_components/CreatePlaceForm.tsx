'use client';

import { CustomSelect, type Option } from '@/components/CustomSelect';
import { Input } from '@/components/ui/Input';
import type { Category } from '@/data/place';
import type { City } from '@/types';
import { setInputError } from '@/utils/inputError';
import { Loader2Icon } from 'lucide-react';
import { useActionState, useState } from 'react';
import { ButtonLoading } from '../../_components/ButtonLoading';
import {
  type CreatePlaceActionResponse,
  createPlaceAction,
  getCitiesByStateAction,
} from './actions';

const initialState: CreatePlaceActionResponse = {
  data: null,
  error: {
    message: '',
    fields: [],
  },
};

export type CreatePlaceFormProps = {
  createdBy?: string;
  stateOptions: Option[];
  activeCategories: Category[];
  onSave?: () => void;
};

export function CreatePlaceForm({
  createdBy,
  stateOptions,
  activeCategories,
  onSave,
}: CreatePlaceFormProps) {
  const [createdPlaceResult, action, _isPending] = useActionState(
    createPlaceAction,
    initialState,
  );

  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cachedCities, setCachedCities] = useState<Record<string, City[]>>({});

  async function fetchCitiesByState(stateId: string | number) {
    setIsLoadingCities(true);

    if (cachedCities[stateId]) {
      setCities(cachedCities[stateId]);
      setIsLoadingCities(false);
      return;
    }

    const { cities } = await getCitiesByStateAction(stateId);

    setCachedCities((prev) => ({
      ...prev,
      [stateId]: cities,
    }));

    setCities(cities);
    setIsLoadingCities(false);
  }

  const cityOptions = cities.map((city) => ({
    label: city.nome,
    value: city.id,
  }));

  return (
    <form
      action={async (formData: FormData) => {
        action(formData);
        onSave?.();
      }}
      className="flex-1 space-y-4"
    >
      <Input
        name="name"
        placeholder="Nome*"
        defaultValue={createdPlaceResult.inputs?.name}
        required
        error={setInputError('name', {
          fields: createdPlaceResult?.error?.fields,
          message: createdPlaceResult?.error?.message,
        })}
      />

      <CustomSelect
        required
        label="País*"
        defaultValue={createdPlaceResult.inputs?.country}
        name="country"
        defaultOption={'Brazil'}
        options={[{ value: 'Brazil', label: 'Brasil' }]}
      />

      <CustomSelect
        required
        searchable
        label="Estado*"
        defaultValue={createdPlaceResult.inputs?.state}
        name="state"
        options={stateOptions}
        useLabelAsValue
        actionOnSelect={fetchCitiesByState}
      />

      {cityOptions.length > 0 ? (
        <CustomSelect
          required
          searchable
          label="Cidade*"
          defaultValue={createdPlaceResult.inputs?.city}
          name="city"
          useLabelAsValue
          options={cityOptions}
        />
      ) : (
        <fieldset className="relative">
          <Input
            name="city"
            placeholder="Cidade*"
            defaultValue={createdPlaceResult.inputs?.city}
            required
            error={setInputError('city', {
              fields: createdPlaceResult?.error?.fields,
              message: createdPlaceResult?.error?.message,
            })}
          />

          {isLoadingCities && (
            <Loader2Icon className="absolute top-2.5 right-3 size-4 animate-spin" />
          )}
        </fieldset>
      )}

      <textarea
        name="description"
        defaultValue={createdPlaceResult.inputs?.description}
        className="max-h-32 w-full p-2 text-sm rounded outline-none bg-slate-200 dark:bg-slate-900"
        placeholder="Descrição do local"
      />

      <CustomSelect
        required
        label="Categoria*"
        defaultValue={createdPlaceResult.inputs?.category_id}
        name="category_id"
        options={activeCategories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
      />

      <Input
        name="street"
        placeholder="Rua"
        defaultValue={createdPlaceResult.inputs?.street}
        error={setInputError('street', {
          fields: createdPlaceResult?.error?.fields,
          message: createdPlaceResult?.error?.message,
        })}
      />

      <Input
        name="num_place"
        placeholder="Número"
        defaultValue={createdPlaceResult.inputs?.num_place}
        type="number"
        error={setInputError('num_place', {
          fields: createdPlaceResult?.error?.fields,
          message: createdPlaceResult?.error?.message,
        })}
      />

      <Input
        name="complement"
        placeholder="Complemento"
        defaultValue={createdPlaceResult.inputs?.complement}
        error={setInputError('complement', {
          fields: createdPlaceResult?.error?.fields,
          message: createdPlaceResult?.error?.message,
        })}
      />

      <div className="flex gap-4">
        <Input
          name="latitude"
          placeholder="Latitude"
          defaultValue={createdPlaceResult.inputs?.latitude}
          type="number"
          error={setInputError('latitude', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />

        <Input
          name="longitude"
          placeholder="Longitude"
          defaultValue={createdPlaceResult.inputs?.longitude}
          type="number"
          error={setInputError('longitude', {
            fields: createdPlaceResult?.error?.fields,
            message: createdPlaceResult?.error?.message,
          })}
        />
      </div>

      <input type="hidden" name="created_by" defaultValue={createdBy} />

      <fieldset className="flex justify-end gap-4">
        <ButtonLoading type="submit">
          Salvar e ir para próxima etapa
        </ButtonLoading>
      </fieldset>
    </form>
  );
}
