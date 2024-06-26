import { database } from '@/infra/database';
import { sql } from '@/src/utils/syntax-highlighting';
import { Place } from '@/types/Place';

export type PlaceDataSource = ReturnType<typeof createPlaceDataSource>;

export function createPlaceDataSource() {
  const placePool = database.getPool();

  return Object.freeze({
    findAll,
  });

  type FindAllInput = {
    limit: number;
    offset: number;
    where?: {
      approved?: 'true' | 'false';
      state?: string;
    };
  };

  async function findAll(input: FindAllInput) {
    const { limit, offset, where } = input;

    const queryText = sql`
      SELECT
        *
      FROM
        places
      $whereClause
      LIMIT $1
      OFFSET $2
    `;

    type QueryObject = {
      text: string;
      values: Array<string | number | boolean>;
    };

    const query: QueryObject = {
      text: queryText,
      values: [limit, offset],
    };

    let index = query.values.length;

    setWhereClause();

    const queryResult = await placePool.query(query);
    return (queryResult?.rows as Array<Place>) ?? [];

    function setWhereClause() {
      const whereClauses = [];

      if (where?.state) {
        whereClauses.push(sql`state = `.concat(`$${++index}`));
        query.values.push(where.state);
      }

      if (where?.approved) {
        const approvedWhereStatement =
          where.approved === 'true' ? sql`approved` : sql`NOT approved`;

        whereClauses.push(approvedWhereStatement);
      }

      let whereClauseText = '';
      if (whereClauses.length > 0) {
        whereClauseText = sql`WHERE `.concat(whereClauses.join(' AND '));
      }

      query.text = query.text.replace('$whereClause', whereClauseText);
    }
  }
}
