import { location } from '@/models/location';

describe('> models/location', () => {
  test('Invoking "getStates" function', async () => {
    const result = await location.getStates();

    expect(result).toStrictEqual({
      error: null,
      data: expect.any(Array),
    });

    expect(result.data[0]).toStrictEqual({
      id: 12,
      sigla: 'AC',
      nome: 'Acre',
      regiao: {
        id: 1,
        sigla: 'N',
        nome: 'Norte',
      },
    });

    expect(result.data.length).toBe(27);
  });

  describe('Invoking "getCitiesByState" function', () => {
    test('Providing a valid "state_id"', async () => {
      const state_id = 32;
      const result = await location.getCitiesByState(state_id);

      expect(result).toStrictEqual({
        error: null,
        data: expect.any(Array),
      });

      expect(result.data?.length).toBe(78);

      expect(result.data?.[0].nome).toStrictEqual('Afonso Cláudio');
    });

    test('Providing undefined "state_id"', async () => {
      const result = await location.getCitiesByState(
        undefined as unknown as number,
      );

      expect(result).toStrictEqual({
        error: {
          message: '"state_id" é obrigatório.',
          fields: ['state_id'],
        },
        data: null,
      });
    });

    test('Providing an invaid type "state_id"', async () => {
      const result = await location.getCitiesByState('32' as unknown as number);

      expect(result).toStrictEqual({
        error: {
          message: '"state_id" precisa ser um número.',
          fields: ['state_id'],
        },
        data: null,
      });
    });

    test('Providing a "state_id" less than 1', async () => {
      const result = await location.getCitiesByState(0);

      expect(result).toStrictEqual({
        error: {
          message: '"state_id" precisa ser um número maior que 0.',
          fields: ['state_id'],
        },
        data: null,
      });
    });
  });
});
