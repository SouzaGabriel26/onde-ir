import pg, { type QueryConfig } from 'pg';

import { env } from '@/utils/env';

const IS_PRODUCTION_ENVIRONMENT = env.NODE_ENV === 'production';

type Query = Pick<QueryConfig, 'text' | 'values'> | string;

export const database = Object.freeze({
  getClient,
  getPool,
  endAllPools,
});

const { DEFAULT_DATABASE_URL } = env;

const pools: Array<pg.Pool> = [];

function getClient() {
  const client = new pg.Client({
    connectionString: DEFAULT_DATABASE_URL,
    ssl: IS_PRODUCTION_ENVIRONMENT,
  });

  async function query(query: Query) {
    try {
      await client.connect();
      return await client.query(query);
    } catch (error) {
      console.error(error);
    } finally {
      await client.end();
    }
  }

  return Object.freeze({
    query,
  });
}

function getPool() {
  const pool = new pg.Pool({
    connectionString: DEFAULT_DATABASE_URL,
    ssl: IS_PRODUCTION_ENVIRONMENT,
    max: 20,
  });

  pools.push(pool);

  async function query(query: Query) {
    const client = await pool.connect();

    try {
      return await client.query(query);
    } catch (error) {
      console.error(error);
    } finally {
      client.release();
    }
  }

  return Object.freeze({
    query,
  });
}

async function endAllPools() {
  const endAllPoolsPromises = pools.map((pool) => pool.end());
  await Promise.all(endAllPoolsPromises);
  pools.length = 0;
}
