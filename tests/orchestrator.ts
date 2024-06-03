import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { database } from '../infra/database';

export const orchestrator = Object.freeze({
  resetDatabase,
});

async function resetDatabase() {
  const queriesFolderPath = resolve('.', 'infra', 'queries');
  const queries = readdirSync(queriesFolderPath, {
    encoding: 'utf-8',
  });

  const resetDatabaseQueryFileName = queries[0];

  const resetDatabaseQuery = readFileSync(
    resolve(queriesFolderPath, resetDatabaseQueryFileName),
    { encoding: 'utf-8' },
  );

  const client = database.getClient();
  await client.query(resetDatabaseQuery);
}
