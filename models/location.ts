import type { City, UF } from '@/types';
import { operationResult } from '@/utils/operationResult';

import { validator } from './validator';

export const location = Object.freeze({
  getStates,
  getCitiesByState,
});

async function getStates() {
  const data = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome',
  );

  const states = (await data.json()) as Array<UF>;

  return operationResult.success(states);
}

async function getCitiesByState(stateId: number) {
  const { data: secureInput, error } = validator(
    {
      state_id: stateId,
    },
    {
      state_id: 'required',
    },
  );

  if (error) return operationResult.failure(error);

  const data = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${secureInput.state_id}/municipios`,
  );

  const cities = (await data.json()) as Array<City>;
  return operationResult.success(cities);
}
