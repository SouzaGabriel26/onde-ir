import { database } from '@/infra/database';
import { orchestrator } from '@/tests/orchestrator';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

afterAll(async () => {
  await database.endAllPools();
});

describe('Testing database connection', () => {
  test('It should connect to the database using client', async () => {
    const client = database.getClient();

    const result = await client.query('SELECT NOW()');

    expect(result?.rowCount).toBe(1);
  });

  test('It should connect to the database using pool', async () => {
    const client = database.getPool();

    const result = await client.query('SELECT NOW()');
    expect(result?.rowCount).toBe(1);
  });
});
