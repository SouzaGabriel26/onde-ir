import { orchestrator } from './orchestrator';

test('Dropping public schema and Creating tables', async () => {
  await orchestrator.resetDatabase();
  expect(true).toBe(true);
});
