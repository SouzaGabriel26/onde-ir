import { database } from '@/infra/database';
import { sql } from '@/src/utils/syntax-highlighting';

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

  type FindAllPlacesOutput = {
    id: string;
    name: string;
    country: string;
    state: string;
    city: string;
    street: string;
    num_place?: number;
    complement?: string;
    description?: string;
    category_id: string;
    latitude?: number;
    longitude?: number;
    approved: boolean;
    approved_by?: string;
    created_by: string;
    created_at: Date;
  };

  async function findAll(input: FindAllInput) {
    const { limit, offset, where } = input;

    const queryText = sql`
      SELECT
        places.*,
        array_remove(ARRAY_AGG(place_images.url), NULL) AS images
      FROM
        places
        LEFT JOIN place_images ON place_images.place_id = places.id
        $whereClause
      GROUP BY
        places.id
      ORDER BY
        places.name
      LIMIT $1
      OFFSET $2;
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
    return (queryResult?.rows as Array<FindAllPlacesOutput>) ?? [];

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
