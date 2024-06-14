import { Client, Pool, QueryConfig } from 'pg';

import { env } from '@/src/utils/env';

const IS_PRODUCTION_ENVIRONMENT = process.env.NODE_ENV === 'production';

type Query = Pick<QueryConfig, 'text' | 'values'> | string;

export const database = Object.freeze({
  getClient,
  getPool,
  endAllPools,
});

const { db_user, db_password, db_host, db_port, default_db } = env;

const databaseConnectionString = `postgres://${db_user}:${db_password}@${db_host}:${db_port}/${default_db}`;

const pools: Array<Pool> = [];

function getClient() {
  const client = new Client({
    connectionString: databaseConnectionString,
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
  const pool = new Pool({
    connectionString: databaseConnectionString,
    ssl: IS_PRODUCTION_ENVIRONMENT,
    max: 1,
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
}
