import { createUserDataSource } from '@/data/user';
import { database } from '@/infra/database';
import { type FindByIdInput, user } from '@/models/user';
import { orchestrator } from '@/tests/orchestrator';
import { sql } from '@/utils/syntax-highlighting';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

afterAll(async () => {
  await database.endAllPools();
});

describe('> models/user', () => {
  describe('Invoking "findById" method', () => {
    test('Providing only a invalid format "id" property', async () => {
      const invalidId = 'invalid_id';

      const userDataSource = createUserDataSource();
      const result = await user.findById(userDataSource, {
        id: invalidId,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userId" precisa ser um UUID válido.',
          fields: ['userId'],
        },
      });
    });

    test('Providing a valid format "id" property but unexistent', async () => {
      const unexistentId = '8b9b6e3f-5c1b-4b0d-9c5a-8b9b6e3f5c1b';

      const userDataSource = createUserDataSource();
      const result = await user.findById(userDataSource, {
        id: unexistentId,
      });

      expect(result).toStrictEqual({
        data: null,
        error: null,
      });
    });

    test('Providing a valid format "id" property and existent', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          id: userIdFromDatabase,
          email: 'user@email.com',
          name: 'Normal user',
          user_name: 'normal_user',
          avatarUrl: null,
          userRole: 'USER',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });

    test('Providing only "id" property as a number', async () => {
      const numericId = 10 as unknown as string;

      const userDataSource = createUserDataSource();
      const result = await user.findById(userDataSource, {
        id: numericId,
      });

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userId" precisa ser uma string.',
          fields: ['userId'],
        },
      });
    });

    test('Providing an empty object ("id is required")', async () => {
      const userDataSource = createUserDataSource();

      const result = await user.findById(userDataSource, {} as FindByIdInput);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: '"userId" é obrigatório.',
          fields: ['userId'],
        },
      });
    });

    test('Providing "select" property as an empty array', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
        select: [],
      });

      expect(foundUser).toStrictEqual({
        data: {
          id: userIdFromDatabase,
          email: 'user@email.com',
          name: 'Normal user',
          user_name: 'normal_user',
          avatarUrl: null,
          userRole: 'USER',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        error: null,
      });
    });

    test('Providing "select" property with "name" and "email" fields', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
        select: ['name', 'email'],
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          name: 'Normal user',
          email: 'user@email.com',
        },
      });
    });

    test('Providing "select" property with a invalid field', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
        select: ['email', 'invalid_field'] as FindByIdInput['select'],
      });

      expect(foundUser).toStrictEqual({
        data: null,
        error: {
          message:
            '"selectUserFields" precisa conter apenas propriedades válidas.',
          fields: ['selectUserFields'],
        },
      });
    });

    test('Providing "select" with only "password" property', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
        select: ['password'],
      });

      expect(foundUser).toStrictEqual({
        error: null,
        data: {
          password: expect.any(String),
        },
      });
    });
  });
});

async function getUserIdFromDatabase() {
  const client = database.getClient();

  const query = await client.query(sql`SELECT id FROM users LIMIT 1`);

  return query?.rows[0].id;
}
