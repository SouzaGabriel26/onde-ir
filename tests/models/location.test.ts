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
    test('Providing a valid "stateId"', async () => {
      const stateId = 32;
      const result = await location.getCitiesByState(stateId);

      expect(result).toStrictEqual({
        error: null,
        data: expect.any(Array),
      });

      expect(result.data?.length).toBe(78);

      expect(result.data?.[0].nome).toStrictEqual('Afonso Cláudio');
    });

    test('Providing undefined "stateId"', async () => {
      const result = await location.getCitiesByState(
        undefined as unknown as number,
      );

      expect(result).toStrictEqual({
        error: {
          message: '"stateId" é obrigatório.',
          fields: ['stateId'],
        },
        data: null,
      });
    });

    test('Providing an invaid type "stateId"', async () => {
      const result = await location.getCitiesByState('32' as unknown as number);

      expect(result).toStrictEqual({
        error: {
          message: '"stateId" precisa ser um número.',
          fields: ['stateId'],
        },
        data: null,
      });
    });

    test('Providing a "stateId" less than 1', async () => {
      const result = await location.getCitiesByState(0);

      expect(result).toStrictEqual({
        error: {
          message: '"stateId" precisa ser um número maior que 0.',
          fields: ['stateId'],
        },
        data: null,
      });
    });
  });
});
