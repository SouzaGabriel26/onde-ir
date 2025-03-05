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

      expect(result.data!.length).toBe(10);
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

      expect(result.data!.length).toBe(10);
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
            average_rating: 0,
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
            name: 'Bar do João',
            country: 'Brasil',
            state: 'RJ',
            city: 'Rio de Janeiro',
            street: 'Av. Atlântica, 456',
            num_place: 7890,
            complement: null,
            description: 'Bar aconchegante com drinks exclusivos.',
            category_id: expect.any(String),
            latitude: -22.9068,
            longitude: -43.1729,
            status: 'APPROVED',
            reviewed_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            average_rating: 0,
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
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            average_rating: 0,
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
            average_rating: 0,
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
            name: 'Bar e Petiscaria Maré Alta',
            country: 'Brasil',
            state: 'PE',
            city: 'Recife',
            street: 'Av. Beira Mar, 321',
            num_place: 9090,
            complement: null,
            description: 'Petiscos e drinks à beira-mar.',
            category_id: expect.any(String),
            latitude: -8.0476,
            longitude: -34.877,
            status: 'APPROVED',
            reviewed_by: expect.any(String),
            created_by: expect.any(String),
            created_at: expect.anything(),
            updated_at: expect.anything(),
            images: expect.any(Array),
            average_rating: 0,
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
            average_rating: 3.5,
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

    test('Providing "categoryName" property', async () => {
      const placeDataSource = createPlaceDataSource();

      const result = await place.findAll(placeDataSource, {
        where: {
          categoryName: 'restaurantes',
          status: 'APPROVED',
        },
      });

      expect(result.data?.length).toBe(10);
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

      expect(placeImagesBefore?.rows.length).toBe(22);

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

      expect(placeImagesAfter?.rows.length).toBe(24);
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
          average_rating: 0,
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

  describe('Invoking "update" method', () => {
    test('Providing valid input', async () => {
      await orchestrator.resetDatabase();

      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: places } = await place.findAll(placeDataSource, {
        limit: 1,
        where: { status: 'PENDING' },
      });

      const pendingPlace = places![0];

      expect(pendingPlace.status).toBe('PENDING');

      const adminUser = await getAdminUserId();

      const result = await place.update(userDataSource, placeDataSource, {
        placeId: pendingPlace.id,
        reviewedBy: adminUser,
        status: 'APPROVED',
      });

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const approvedPlace = await place.findById(
        placeDataSource,
        pendingPlace.id,
      );

      expect(approvedPlace.data?.status).toBe('APPROVED');
    });

    test('Providing a "placeId" that does not exists', async () => {
      await orchestrator.resetDatabase();

      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const adminUser = await getAdminUserId();

      const result = await place.update(userDataSource, placeDataSource, {
        placeId: randomUUID(),
        reviewedBy: adminUser,
        status: 'APPROVED',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Local não encontrado.',
          fields: ['place_id'],
        },
      });
    });

    test('Providing a "reviewedBy" that does not exists', async () => {
      await orchestrator.resetDatabase();

      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: places } = await place.findAll(placeDataSource, {
        limit: 1,
        where: { status: 'PENDING' },
      });

      const pendingPlace = places![0];

      const result = await place.update(userDataSource, placeDataSource, {
        placeId: pendingPlace.id,
        reviewedBy: randomUUID(),
        status: 'APPROVED',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Usuário não encontrado.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing a "reviewedBy" that exists but is not a ADMIN', async () => {
      await orchestrator.resetDatabase();

      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: places } = await place.findAll(placeDataSource, {
        limit: 1,
        where: { status: 'PENDING' },
      });

      const pendingPlace = places![0];

      const normalUser = await getNormalUserId();

      const result = await place.update(userDataSource, placeDataSource, {
        placeId: pendingPlace.id,
        reviewedBy: normalUser,
        status: 'APPROVED',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Você não tem permissão para alterar o status do local.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing a "reviewedBy" that is the same user that created the place', async () => {
      await orchestrator.resetDatabase();

      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: categories } = await place.findCategories(placeDataSource, {
        where: { is_active: true },
      });

      const adminUser = await getAdminUserId();

      const { data: createdPlace } = await place.create(
        userDataSource,
        placeDataSource,
        {
          category_id: categories[0].id,
          city: 'Vila Velha',
          country: 'Brasil',
          created_by: adminUser,
          name: 'Bar do Zé',
          state: 'ES',
          street: 'Av. Hugo Musso',
        },
      );

      expect(createdPlace?.id).toBeDefined();

      const result = await place.update(userDataSource, placeDataSource, {
        placeId: createdPlace!.id,
        reviewedBy: adminUser,
        status: 'APPROVED',
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Você não pode alterar o status do seu próprio local.',
          fields: ['user_id'],
        },
      });
    });

    async function getAdminUserId() {
      const client = database.getClient();
      const queryResult = await client.query(sql`
        SELECT id FROM users WHERE user_role = 'ADMIN' LIMIT 1;
      `);
      const adminUser = queryResult!.rows[0].id as string;
      return adminUser;
    }

    async function getNormalUserId() {
      const client = database.getClient();
      const queryResult = await client.query(sql`
        SELECT id FROM users WHERE user_role = 'USER' LIMIT 1;
      `);
      const normalUser = queryResult!.rows[0].id as string;
      return normalUser;
    }
  });

  describe('Invoking "findComments" method', () => {
    test('Providing invalid "placeId"', async () => {
      const placeDataSource = createPlaceDataSource();
      const result = await place.findComments(placeDataSource, '123');

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"place_id" precisa ser um UUID válido.',
          fields: ['place_id'],
        },
      });
    });

    test('Providing valid "placeId"', async () => {
      const placeDataSource = createPlaceDataSource();
      const { data } = await place.findAll(placeDataSource, {
        where: {
          name: 'Churrascaria Espeto de Ouro',
        },
      });

      const placeId = data![0].id;

      const result = await place.findComments(placeDataSource, placeId);

      expect(result).toStrictEqual({
        error: null,
        data: [
          {
            id: expect.any(String),
            user_id: expect.any(String),
            place_id: placeId,
            description: 'Achei interessante este local, frequento bastante!',
            parent_comment_id: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            avatar_url: null,
            user_name: 'Admin user',
          },
          {
            id: expect.any(String),
            user_id: expect.any(String),
            place_id: placeId,
            description:
              'Local muito bonito e aconchegante! Recomendo demais, vou todo mês com minha família.',
            parent_comment_id: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            avatar_url: null,
            user_name: 'Normal user',
            child_comments: [
              {
                id: expect.any(String),
                user_id: expect.any(String),
                place_id: placeId,
                description: 'Que legal!',
                parent_comment_id: expect.any(String),
                created_at: expect.any(Date),
                updated_at: expect.any(Date),
                avatar_url: null,
                user_name: 'Admin user',
              },
            ],
          },
        ],
      });
    });
  });

  describe('Invoking "createComment" method', () => {
    test('Providing invalid inputs', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          userId: '',
          placeId: '123',
          parentCommentId: '123',
          description: 'knasdjkasdnasj',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"place_id" precisa ser um UUID válido.',
          fields: ['place_id'],
        },
      });
    });

    test('Providing an unexistent "placeId"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const placeId = randomUUID();
      const userId = randomUUID();
      const commentId = randomUUID();

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          placeId,
          userId,
          parentCommentId: commentId,
          description: 'knasdjkasdnasj',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Local não encontrado.',
          fields: ['place_id'],
        },
      });
    });

    test('Providing an unexistent "userId"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const userId = randomUUID();
      const commentId = randomUUID();

      const places = await placeDataSource.findAll({
        limit: 1,
        offset: 0,
        where: {
          status: 'APPROVED',
        },
      });

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          placeId: places[0].id,
          userId,
          parentCommentId: commentId,
          description: 'knasdjkasdnasj',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Usuário não encontrado.',
          fields: ['user_id'],
        },
      });
    });

    test('Providing an unexistent "parentCommentId"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const userId = await getUserId();
      const commentId = randomUUID();

      const places = await placeDataSource.findAll({
        limit: 1,
        offset: 0,
        where: {
          status: 'APPROVED',
        },
      });

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          placeId: places[0].id,
          userId,
          parentCommentId: commentId,
          description: 'knasdjkasdnasj',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Comentário pai não encontrado.',
          fields: ['parent_comment_id'],
        },
      });
    });

    test('Providing valid properties without "parent_comment_id"', async () => {
      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();
      const userId = await getUserId();

      const places = await placeDataSource.findAll({
        limit: 1,
        offset: 0,
        where: {
          status: 'APPROVED',
        },
      });

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          placeId: places[0].id,
          userId,
          description: 'test description',
        },
      );

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const comments = await placeDataSource.findComments(places[0].id);

      expect(comments[0].description).toBe('test description');
      expect(comments[0].parent_comment_id).toBeNull();

      await orchestrator.resetDatabase();
    });

    test('Trying to comment on a post that is "PENDING"', async () => {
      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: pendingPlaces } = await place.findAll(placeDataSource, {
        where: {
          status: 'PENDING',
        },
        limit: 1,
      });

      const placeId = pendingPlaces![0].id;
      const userId = await getNormalUserId();

      const result = await place.createComment(
        userDataSource,
        placeDataSource,
        {
          placeId,
          userId,
          description: 'test comment',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Você não pode comentar em um post que não foi aprovado.',
          fields: ['place_id'],
        },
      });
    });
  });

  describe('Invoking "deleteComment" method', () => {
    test('Providing invalid "commentId"', async () => {
      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const result = await place.deleteComment(
        userDataSource,
        placeDataSource,
        {
          commentId: '123',
          userId: '123',
          placeId: '123',
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"comment_id" precisa ser um UUID válido.',
          fields: ['comment_id'],
        },
      });
    });

    test('Providing valid "commentId" but a userId with no permission', async () => {
      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: placeWithComments } = await place.findAll(placeDataSource, {
        where: {
          name: 'Churrascaria Espeto de Ouro',
        },
      });

      const comments = await place.findComments(
        placeDataSource,
        placeWithComments![0].id,
      );

      expect(comments.data).toHaveLength(2);

      const userId = await getNormalUserId();

      const result = await place.deleteComment(
        userDataSource,
        placeDataSource,
        {
          commentId: comments.data![0].id,
          userId: userId,
          placeId: placeWithComments![0].id,
        },
      );

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'Você não tem permissão para deletar este comentário',
          fields: ['user_id'],
        },
      });
    });

    test('Providing valid "commentId"', async () => {
      const placeDataSource = createPlaceDataSource();
      const userDataSource = createUserDataSource();

      const { data: placeWithComments } = await place.findAll(placeDataSource, {
        where: {
          name: 'Churrascaria Espeto de Ouro',
        },
      });

      const comments = await place.findComments(
        placeDataSource,
        placeWithComments![0].id,
      );

      expect(comments.data).toHaveLength(2);

      await place.deleteComment(userDataSource, placeDataSource, {
        commentId: comments.data![1].id,
        userId: comments.data![1].user_id,
        placeId: placeWithComments![0].id,
      });

      const commentsAfterDelete = await place.findComments(
        placeDataSource,
        placeWithComments![0].id,
      );

      expect(commentsAfterDelete.data).toHaveLength(1);
    });
  });

  describe('Invoking "updateComment" method', () => {
    test('Providing valid inputs', async () => {
      await orchestrator.resetDatabase();

      const userDataSource = createUserDataSource();
      const placeDataSource = createPlaceDataSource();

      const { data: placeWithComments } = await place.findAll(placeDataSource, {
        where: {
          name: 'Churrascaria Espeto de Ouro',
        },
      });

      const placeId = placeWithComments![0].id;

      const { data: comments } = await place.findComments(
        placeDataSource,
        placeId,
      );

      expect(comments![0].description).toBe(
        'Achei interessante este local, frequento bastante!',
      );

      const result = await place.updateComment(
        userDataSource,
        placeDataSource,
        {
          userId: comments![0].user_id,
          commentId: comments![0].id,
          description: 'Updated comment',
        },
      );
      await placeDataSource.deleteComment({
        commentId: comments![1].id,
        placeId: comments![1].place_id,
        userId: comments![1].user_id,
      });

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const { data: commentsAfterUpdate } = await place.findComments(
        placeDataSource,
        placeId,
      );

      expect(commentsAfterUpdate![0].description).toBe('Updated comment');
    });
  });

  describe('Invoking "evaluate" and "findUserRating" method', () => {
    test('Providing valid inputs', async () => {
      const placeDataSource = createPlaceDataSource();

      const { data } = await place.findAll(placeDataSource, {
        limit: 1,
        where: { status: 'APPROVED' },
      });

      const placeId = data![0].id;

      const userId = await getNormalUserId();

      const { data: userRating } = await place.findUserRating(placeDataSource, {
        placeId,
        userId,
      });

      expect(userRating).toBeNull();

      const result = await place.evaluate(placeDataSource, {
        placeId,
        userId,
        evaluation: 4,
      });

      expect(result).toStrictEqual({
        data: {},
        error: null,
      });

      const { data: userRatingAfterEvaluate } = await place.findUserRating(
        placeDataSource,
        {
          placeId,
          userId,
        },
      );

      expect(userRatingAfterEvaluate).toStrictEqual({
        id: expect.any(String),
        rating: 4,
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

async function getNormalUserId() {
  const client = database.getClient();

  const query = {
    text: sql`
      SELECT id
      FROM users
      WHERE
        user_role = 'USER'
      LIMIT 1;
    `,
  };

  const queryResult = await client.query(query);

  return queryResult?.rows[0].id;
}
