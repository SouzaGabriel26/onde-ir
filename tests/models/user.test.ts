import { createUserDataSource } from '@/data/user';
import { database } from '@/infra/database';
import { user } from '@/models/user';
import { sql } from '@/src/utils/syntax-highlighting';
import { orchestrator } from '@/tests/orchestrator';

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
          message: 'A propriedade "id" deve ser um UUID',
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
          email: 'janedoe@email.com',
          name: 'Jane Doe',
          userName: 'janeDoe',
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
          message: 'A propriedade "id" deve ser uma string',
        },
      });
    });

    test('Providing an empty object ("id is required")', async () => {
      const userDataSource = createUserDataSource();

      const result = await user.findById(userDataSource, {} as any);

      expect(result).toStrictEqual({
        data: null,
        error: {
          message: 'A propriedade "id" é obrigatória',
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
          email: 'janedoe@email.com',
          name: 'Jane Doe',
          userName: 'janeDoe',
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
          name: 'Jane Doe',
          email: 'janedoe@email.com',
        },
      });
    });

    test('Providing "select" property with a invalid field', async () => {
      const userDataSource = createUserDataSource();

      const userIdFromDatabase = await getUserIdFromDatabase();

      const foundUser = await user.findById(userDataSource, {
        id: userIdFromDatabase,
        select: ['email', 'invalid_field'] as any,
      });

      expect(foundUser).toStrictEqual({
        data: null,
        error: {
          message:
            'A propriedade "select" deve conter apenas propriedades válidas',
        },
      });
    });
  });
});

async function getUserIdFromDatabase() {
  const client = database.getClient();

  try {
    console.log('> Running query to get user ID');
    const query = await client.query(sql`SELECT id FROM users LIMIT 1`);
    console.log('> Query result:', query);

    if (!query?.rows || query.rows.length === 0) {
      throw new Error('No users found in the database');
    }

    return query.rows[0].id;
  } finally {
    console.log('> terminou');
  }
}
