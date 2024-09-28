import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { database } from '../infra/database';

export const orchestrator = Object.freeze({
  resetDatabase,
});

async function resetDatabase() {
  const queriesFolderPath = resolve('.', 'infra', 'queries');
  const queries = readdirSync(queriesFolderPath, {
    encoding: 'utf-8',
  });

  let queryFileNameToResetDatabase = '';
  const queryFileNamesToPopulateDatabase: string[] = [];

  for (const query of queries) {
    if (query.startsWith('drop-schema')) {
      queryFileNameToResetDatabase = query;
      continue;
    }

    queryFileNamesToPopulateDatabase.push(query);
  }

  if (!queryFileNameToResetDatabase) {
    console.error('No reset database query found');
    return;
  }

  const resetDatabaseQuery = readFileSync(
    resolve(queriesFolderPath, queryFileNameToResetDatabase),
    { encoding: 'utf-8' },
  );

  const client = database.getClient();
  await client.query(resetDatabaseQuery);

  for (const queryFileNameToPopulateTable of queryFileNamesToPopulateDatabase) {
    const populateTableQuery = readFileSync(
      resolve(queriesFolderPath, queryFileNameToPopulateTable),
      { encoding: 'utf-8' },
    );

    const client = database.getClient();
    await client.query(populateTableQuery);
  }
}
