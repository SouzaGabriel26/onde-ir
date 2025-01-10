import crypto, { randomBytes, randomUUID } from 'node:crypto';

import { createPlaceDataSource } from '@/data/place';
import { database } from '@/infra/database';
import { place } from '@/models/place';
import { sql } from '@/utils/syntax-highlighting';

import { createUserDataSource } from '@/data/user';
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
            status: 'REJECTED',
            reviewed_by: expect.any(String),
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
            status: 'APPROVED',
            reviewed_by: expect.any(String),
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
            status: 'APPROVED',
            reviewed_by: expect.any(String),
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
            status: 'PENDING',
            reviewed_by: null,
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
      const result = await place.findAll(placeDataSource, {
        page: '1' as unknown as number,
      });

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
        limit: '10' as unknown as number,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"limit" precisa ser um número.',
          fields: ['limit'],
        },
      });
    });

    test('Providing "where" with status equals to "APPROVED"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        where: {
          status: 'APPROVED',
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
            status: 'APPROVED',
            reviewed_by: expect.any(String),
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
            status: 'APPROVED',
            reviewed_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "where" status equals to "REJECTED"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findAll(placeDataSource, {
        where: {
          status: 'REJECTED',
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
            status: 'REJECTED',
            reviewed_by: expect.any(String),
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
            status: 'PENDING',
            reviewed_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "where" with "state" property containing less than 2 characters', async () => {
      const placeDataSource = createPlaceDataSource();

      const result = await place.findAll(placeDataSource, {
        where: {
          state: 'E',
        },
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"state" precisa ter no mínimo 2 caracteres.',
          fields: ['state'],
        },
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
            status: 'REJECTED',
            reviewed_by: expect.any(String),
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
            status: 'APPROVED',
            reviewed_by: expect.any(String),
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
            status: 'PENDING',
            reviewed_by: null,
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
          },
        ],
      });
    });

    test('Providing "name" property', async () => {
      const placeDataSource = createPlaceDataSource();

      const { data: places } = await place.findAll(placeDataSource, {
        limit: 1,
      });

      const result = await place.findAll(placeDataSource, {
        where: {
          name: places?.[0].name,
        },
      });

      expect(result.error).toBeNull();
      expect(result.data?.[0].name).toBe(places?.[0].name);
    });
  });

  describe('Invoking "create" method', () => {
    test('Providing valid input', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();

      const createdBy = await getUserId();
      const categories = await placeDataSource.findCategories();

      const result = await place.create(userDataSource, placeDataSource, {
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
          id: expect.any(String),
          name: 'Bar do Zé',
          country: 'Brasil',
          state: 'ES',
        },
        error: null,
      });
    });

    test('Providing unexistent "category_id"', async () => {
      const uuid = crypto.randomUUID();
      const category_uuid = crypto.randomUUID();

      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const result = await place.create(userDataSource, placeDataSource, {
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
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();

      const categories = await placeDataSource.findCategories();
      const uuid = crypto.randomUUID();

      const result = await place.create(userDataSource, placeDataSource, {
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

    test('Providing an existent "name"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const { data: places } = await place.findAll(placeDataSource, {
        limit: 1,
      });

      const existentPlaceName = places![0].name;

      const result = await place.create(userDataSource, placeDataSource, {
        name: existentPlaceName,
        category_id: places![0].category_id,
        city: places![0].city,
        country: places![0].country,
        created_by: places![0].created_by,
        state: places![0].state,
        street: places![0].street,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: `Já existe um local registrado com o nome ${existentPlaceName}.`,
          fields: ['name'],
        },
      });
    });
  });

  describe('Invoking "createImages" method', () => {
    test('Providing invalid "place_id"', async () => {
      const placeDataSource = createPlaceDataSource();

      const result = await place.createImages(placeDataSource, {
        place_id: '123',
        description: 'imagem do local',
        urls: ['http://example.com/image.jpg'],
      });

      expect(result).toStrictEqual({
        error: {
          message: '"place_id" precisa ser um UUID válido.',
          fields: ['place_id'],
        },
        data: null,
      });
    });

    test('Providing invalid "urls" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const placeId = randomUUID();

      const result = await place.createImages(placeDataSource, {
        place_id: placeId,
        description: 'imagem do local',
        urls: ['http://example.com/image.jpg', 123 as unknown as string],
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"urls" precisa ser um array de strings.',
          fields: ['urls'],
        },
      });
    });

    test('Providing "urls" as an empty array', async () => {
      const placeDataSource = createPlaceDataSource();
      const placeId = randomUUID();
      const result = await place.createImages(placeDataSource, {
        place_id: placeId,
        urls: [],
        description: 'imagem do local',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"urls" precisa ter no mínimo 1 item.',
          fields: ['urls'],
        },
      });
    });

    test('Providing invalid "description" property', async () => {
      const placeDataSource = createPlaceDataSource();
      const placeId = randomUUID();

      const result = await place.createImages(placeDataSource, {
        place_id: placeId,
        description: 123 as unknown as string,
        urls: ['http://example.com/image.jpg'],
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"description" precisa ser uma string.',
          fields: ['description'],
        },
      });
    });

    test('Providing a non-existent "place_id"', async () => {
      const placeDataSource = createPlaceDataSource();
      const placeId = randomUUID();

      const result = await place.createImages(placeDataSource, {
        place_id: placeId,
        description: 'imagem do local',
        urls: ['http://example.com/image.jpg', 'http://example.com/image2.jpg'],
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Local não encontrado.',
          fields: ['place_id'],
        },
      });
    });

    test('Providing a valid input', async () => {
      await orchestrator.resetDatabase();

      const testPool = database.getPool();
      const placeImagesBefore = await testPool.query(sql`
        SELECT * FROM place_images
      `);

      expect(placeImagesBefore?.rows.length).toBe(5);

      const placeDataSource = createPlaceDataSource();
      const places = await place.findAll(placeDataSource, { limit: 1 });

      const result = await place.createImages(placeDataSource, {
        place_id: places.data![0].id,
        description: 'imagem do local',
        urls: ['http://example.com/image.jpg', 'http://example.com/image2.jpg'],
      });

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const placeImagesAfter = await testPool.query(sql`
        SELECT * FROM place_images
      `);

      expect(placeImagesAfter?.rows.length).toBe(7);
    });
  });

  describe('Invoking "findById" method', () => {
    test('Providing valid place "id"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const categories = await placeDataSource.findCategories();
      const name = randomBytes(10).toString('hex');

      const createdBy = await getUserId();

      const { data: createdPlace } = await place.create(
        userDataSource,
        placeDataSource,
        {
          name,
          category_id: categories[0].id,
          city: 'Vila Velha',
          country: 'Brasil',
          created_by: createdBy,
          state: 'ES',
          street: 'Av. Hugo Musso',
        },
      );

      const result = await place.findById(placeDataSource, createdPlace!.id);

      expect(result).toStrictEqual({
        error: null,
        data: {
          id: expect.any(String),
          name,
          country: 'Brasil',
          state: 'ES',
          city: 'Vila Velha',
          street: 'Av. Hugo Musso',
          num_place: null,
          complement: null,
          description: null,
          category_id: expect.any(String),
          latitude: null,
          longitude: null,
          status: 'PENDING',
          reviewed_by: null,
          created_by: createdBy,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          images: [],
        },
      });
    });
  });

  describe('Invoking "findCategories" method', () => {
    test('Without providing input', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findCategories(placeDataSource);

      expect(result).toStrictEqual({
        data: [
          {
            id: expect.any(String),
            name: 'restaurantes',
            is_active: true,
          },
          {
            id: expect.any(String),
            name: 'parques',
            is_active: false,
          },
          {
            id: expect.any(String),
            name: 'museus',
            is_active: false,
          },
          {
            id: expect.any(String),
            name: 'bares',
            is_active: true,
          },
        ],
        error: null,
      });
    });

    test('Providing "is_active" as "true"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findCategories(placeDataSource, {
        where: { is_active: true },
      });

      expect(result).toStrictEqual({
        data: [
          {
            id: expect.any(String),
            name: 'restaurantes',
            is_active: true,
          },
          {
            id: expect.any(String),
            name: 'bares',
            is_active: true,
          },
        ],
        error: null,
      });
    });

    test('Providing "is_active" as "false"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findCategories(placeDataSource, {
        where: { is_active: false },
      });

      expect(result).toStrictEqual({
        data: [
          {
            id: expect.any(String),
            name: 'parques',
            is_active: false,
          },
          {
            id: expect.any(String),
            name: 'museus',
            is_active: false,
          },
        ],
        error: null,
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
