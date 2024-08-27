import crypto from 'node:crypto';

import { createPlaceDataSource } from '@/data/place';
import { database } from '@/infra/database';
import { place } from '@/models/place';
import { sql } from '@/utils/syntax-highlighting';

import { orchestrator } from '../orchestrator';

beforeAll(async () => {
  await orchestrator.resetDatabase();
  await database.endAllPools();
});

describe('> models/place', () => {
  describe('Invoking "findAll" method', () => {
    test('Without providing input', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource);

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Bar do Gerson',
            country: 'Brasil',
            state: 'ES',
            city: 'Vila Velha',
            street: 'Av. Hugo Musso',
            num_place: 505,
            complement: null,
            description:
              'Bar muito conhecido por seu ambiente agradável e bebidas geladas',
            category_id: expect.any(String),
            latitude: -20.3274,
            longitude: -40.2922,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Café Bamboo',
            country: 'Brasil',
            state: 'ES',
            city: 'Vitória',
            street: 'R. do Lazer',
            num_place: 404,
            complement: 'Em frente a padaria',
            description:
              'Um café incrivel que oferece vários sabores inexplicáveis',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.2969,
            approved: true,
            approved_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Churrascaria Espeto de Ouro',
            country: 'Brasil',
            state: 'ES',
            city: 'Vitória',
            street: 'Av. Nossa Senhora da Penha',
            num_place: 1234,
            complement: null,
            description: 'Deliciosa churrascaria com variedade de comidas.',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: true,
            approved_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Pizzaria do Zé',
            country: 'Brasil',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Av. Jerônimo Monteiro',
            num_place: 1234,
            complement: null,
            description: 'Pizzaria com variedade de sabores e promoções',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "page" less than 1', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, { page: 0 });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número maior que 0.',
          fields: ['page'],
        },
      });
    });

    test('Providing invalid type for "page" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, { page: '1' as any });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"page" precisa ser um número.',
          fields: ['page'],
        },
      });
    });

    test('Providing "limit" less than 1', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, { limit: 0 });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número maior que 0.',
          fields: ['limit'],
        },
      });
    });

    test('Providing invalid type for "limit" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        limit: '10' as any,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número.',
          fields: ['limit'],
        },
      });
    });

    test('Providing "where" with "approved" property as true', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        where: {
          approved: 'true',
        },
      });

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Café Bamboo',
            country: 'Brasil',
            state: 'ES',
            city: 'Vitória',
            street: 'R. do Lazer',
            num_place: 404,
            complement: 'Em frente a padaria',
            description:
              'Um café incrivel que oferece vários sabores inexplicáveis',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.2969,
            approved: true,
            approved_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Churrascaria Espeto de Ouro',
            country: 'Brasil',
            state: 'ES',
            city: 'Vitória',
            street: 'Av. Nossa Senhora da Penha',
            num_place: 1234,
            complement: null,
            description: 'Deliciosa churrascaria com variedade de comidas.',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: true,
            approved_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "where" with "approved" property as false', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        where: {
          approved: 'false',
        },
      });

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Bar do Gerson',
            country: 'Brasil',
            state: 'ES',
            city: 'Vila Velha',
            street: 'Av. Hugo Musso',
            num_place: 505,
            complement: null,
            description:
              'Bar muito conhecido por seu ambiente agradável e bebidas geladas',
            category_id: expect.any(String),
            latitude: -20.3274,
            longitude: -40.2922,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Pizzaria do Zé',
            country: 'Brasil',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Av. Jerônimo Monteiro',
            num_place: 1234,
            complement: null,
            description: 'Pizzaria com variedade de sabores e promoções',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "where" with "state" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        where: {
          state: 'RJ',
        },
      });

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Pizzaria do Zé',
            country: 'Brasil',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Av. Jerônimo Monteiro',
            num_place: 1234,
            complement: null,
            description: 'Pizzaria com variedade de sabores e promoções',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "limit" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        limit: 1,
      });

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Bar do Gerson',
            country: 'Brasil',
            state: 'ES',
            city: 'Vila Velha',
            street: 'Av. Hugo Musso',
            num_place: 505,
            complement: null,
            description:
              'Bar muito conhecido por seu ambiente agradável e bebidas geladas',
            category_id: expect.any(String),
            latitude: -20.3274,
            longitude: -40.2922,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "page" property with "limit"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        page: 2,
        limit: 2,
      });

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            name: 'Churrascaria Espeto de Ouro',
            country: 'Brasil',
            state: 'ES',
            city: 'Vitória',
            street: 'Av. Nossa Senhora da Penha',
            num_place: 1234,
            complement: null,
            description: 'Deliciosa churrascaria com variedade de comidas.',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: true,
            approved_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
          {
            id: expect.any(String),
            name: 'Pizzaria do Zé',
            country: 'Brasil',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Av. Jerônimo Monteiro',
            num_place: 1234,
            complement: null,
            description: 'Pizzaria com variedade de sabores e promoções',
            category_id: expect.any(String),
            latitude: -20.3155,
            longitude: -40.3128,
            approved: false,
            approved_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });
  });

  describe('Invoking "create" method', () => {
    test('Providing valid input', async () => {
      const placeDataSource = createPlaceDataSource();

      const createdBy = await getUserId();
      const categories = await placeDataSource.findCategories();

      const result = await place.create(placeDataSource, {
        name: 'Bar do Zé',
        category_id: categories[0].id,
        city: 'Vila Velha',
        country: 'Brasil',
        created_by: createdBy,
        state: 'ES',
        street: 'Av. Hugo Musso',
      });

      expect(result).toStrictEqual({
        data: {
          place: {
            id: expect.any(String),
            name: 'Bar do Zé',
          },
        },
        error: null,
      });
    });

    test('Providing unexistent "category_id"', async () => {
      const uuid = crypto.randomUUID();
      const category_uuid = crypto.randomUUID();

      const placeDataSource = createPlaceDataSource();
      const result = await place.create(placeDataSource, {
        name: 'Bar do Zé',
        category_id: category_uuid,
        city: 'Vila Velha',
        country: 'Brasil',
        created_by: uuid,
        state: 'ES',
        street: 'Av. Hugo Musso',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'ID da categoria não encontrada.',
          fields: ['category_id'],
        },
      });
    });

    test('Providing unexistent "created_by"', async () => {
      const placeDataSource = createPlaceDataSource();

      const categories = await placeDataSource.findCategories();
      const uuid = crypto.randomUUID();

      const result = await place.create(placeDataSource, {
        name: 'Bar do Zé',
        category_id: categories[0].id,
        city: 'Vila Velha',
        country: 'Brasil',
        created_by: uuid,
        state: 'ES',
        street: 'Av. Hugo Musso',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Usuário não encontrado.',
          fields: ['created_by'],
        },
      });
    });
  });
});

async function getUserId() {
  const client = database.getClient();

  const query = {
    text: sql`
      SELECT id
      FROM users
      LIMIT 1;
    `,
  };

  const queryResult = await client.query(query);

  return queryResult?.rows[0].id;
}
