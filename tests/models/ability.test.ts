import { createUserDataSource } from '@/data/user';
import { database } from '@/infra/database';
import { ability } from '@/models/ability';
import { sql } from '@/src/utils/syntax-highlighting';

import { orchestrator } from '../orchestrator';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

describe('models/ability', () => {
  test('Providing a invalid userId', async () => {
    const userDataSource = createUserDataSource();
    const result = await ability.hasPermissionTo(userDataSource, {
      userId: '1234',
      ability: 'manage_all',
    });

    expect(result).toStrictEqual({
      message: '"userId" precisa ser um UUID válido.',
      fields: ['userId'],
    });
  });

  test('Providing a non-existent userId', async () => {
    const userDataSource = createUserDataSource();
    const result = await ability.hasPermissionTo(userDataSource, {
      userId: '00000000-0000-0000-0000-000000000000',
      ability: 'manage_all',
    });

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: 'Usuário não encontrado.',
      },
    });
  });

  test('Providing a normal USER id and a user permission', async () => {
    const client = database.getClient();

    const queryResult = await client.query(sql`
      SELECT
        id
      FROM
        users
      WHERE
        user_role = 'USER'
    `);

    const userId = queryResult?.rows[0]?.id;

    const userDataSource = createUserDataSource();
    const result = await ability.hasPermissionTo(userDataSource, {
      userId: userId,
      ability: 'create',
    });

    expect(result).toStrictEqual({
      data: {},
      error: null,
    });
  });

  test('Providing a ADMIN id and a admin permission', async () => {
    const client = database.getClient();

    const queryResult = await client.query(sql`
      SELECT
        id
      FROM
        users
      WHERE
        user_role = 'ADMIN'
    `);

    const userId = queryResult?.rows[0]?.id;

    const userDataSource = createUserDataSource();
    const result = await ability.hasPermissionTo(userDataSource, {
      userId: userId,
      ability: 'manage_all',
    });

    expect(result).toStrictEqual({
      data: {},
      error: null,
    });
  });

  test('Providing a user id and a permisson that is not permited', async () => {
    const client = database.getClient();

    const queryResult = await client.query(sql`
      SELECT
        id
      FROM
        users
      WHERE
        user_role = 'USER'
    `);

    const userId = queryResult?.rows[0]?.id;

    const userDataSource = createUserDataSource();
    const result = await ability.hasPermissionTo(userDataSource, {
      userId: userId,
      ability: 'manage_all',
    });

    expect(result).toStrictEqual({
      data: null,
      error: {
        message: 'Permissão negada.',
      },
    });
  });
});
