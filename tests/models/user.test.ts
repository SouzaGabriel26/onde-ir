import { createUserDataSource } from '@/data/user';
import { database } from '@/infra/database';
import { user } from '@/models/user';
import { sql } from '@/src/utils/syntax-highlighting';

import { orchestrator } from '../orchestrator';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

afterAll(async () => {
  await database.endAllPools();
});

describe('> models/user', () => {
  describe('Invoking "findById" method', () => {
    test('Providing only "id" property that is not a UUID', async () => {
      const userDataSource = createUserDataSource();

      const invalidUUID = '123';

      const result = await user.findById(userDataSource, {
        id: invalidUUID,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A propriedade "id" deve ser um UUID',
        },
      });
    });

    test('Providing only an existing "id" property', async () => {
      const userDataSource = createUserDataSource();

      const userIds = await getUserIds();

      const foundUser = await user.findById(userDataSource, {
        id: userIds[1],
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          id: userIds[1],
          email: 'gabriel@email.com',
          name: 'Gabriel',
          userName: 'gbsouza',
          userRole: 'ADMIN',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    test('Providing an existing "id" with "select" property', async () => {
      const userDataSource = createUserDataSource();

      const userIds = await getUserIds();

      const foundUser = await user.findById(userDataSource, {
        id: userIds[1],
        select: ['id', 'name', 'email'],
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          id: userIds[1],
          email: 'gabriel@email.com',
          name: 'Gabriel',
        },
      });
    });

    test('Providing "select" with unsupported property', async () => {
      const userDataSource = createUserDataSource();

      const userIds = await getUserIds();

      const result = await user.findById(userDataSource, {
        id: userIds[0],
        select: ['email', 'invalid_value'] as any,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message:
            'A propriedade "select" deve conter apenas propriedades válidas',
        },
      });
    });

    test('Providing an unexisting "id" property', async () => {
      const userDataSource = createUserDataSource();

      const result = await user.findById(userDataSource, {
        id: '00000000-0000-0000-0000-000000000000',
      });

      expect(result).toStrictEqual({
        error: null,
        data: null,
      });
    });

    test('Providing an empty object', async () => {
      const userDataSource = createUserDataSource();

      const result = await user.findById(userDataSource, {} as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A proprietade "id" é obrigatória',
        },
      });
    });

    test('Providing "select" property with "name" and "email" options', async () => {
      const userDataSource = createUserDataSource();

      const userIds = await getUserIds();

      const foundUser = await user.findById(userDataSource, {
        id: userIds[0],
        select: ['name', 'email'],
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          name: 'Jane Doe',
          email: 'janedoe@email.com',
        },
      });
    });

    test('Providing "select" as an empty array', async () => {
      const userDataSource = createUserDataSource();

      const userIds = await getUserIds();

      const result = await user.findById(userDataSource, {
        id: userIds[0],
        select: [],
      });

      expect(result).toStrictEqual({
        error: null,
        data: {
          id: userIds[0],
          email: 'janedoe@email.com',
          name: 'Jane Doe',
          userName: 'janeDoe',
          userRole: 'USER',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });
});

async function getUserIds() {
  const client = database.getClient();

  const query = sql`
    SELECT
      id
    FROM
      users
  `;

  const queryResult = await client.query(query);

  return queryResult?.rows.map((row) => row.id) ?? [];
}
