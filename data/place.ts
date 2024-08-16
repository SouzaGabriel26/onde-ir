import { database } from '@/infra/database';
import { CreatePlaceInput } from '@/models/place';
import { sql } from '@/src/utils/syntax-highlighting';

export type PlaceDataSource = ReturnType<typeof createPlaceDataSource>;

export function createPlaceDataSource() {
  const placePool = database.getPool();

  return Object.freeze({
    findAll,
    create,
    findCategories,
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

  async function create(input: CreatePlaceInput) {
    const query = {
      text: sql`
        INSERT INTO places (
          name,
          country,
          state,
          city,
          street,
          num_place,
          complement,
          description,
          category_id,
          latitude,
          longitude,
          created_by
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12
        )
        RETURNING
          id, name;
      `,
      values: [
        input.name,
        input.country,
        input.state,
        input.city,
        input.street,
        input.num_place,
        input.complement,
        input.description,
        input.category_id,
        input.latitude,
        input.longitude,
        input.created_by,
      ],
    };

    const queryResult = await placePool.query(query);
    type CreatePlaceOutput = {
      id: string;
      name: string;
    };

    return (queryResult?.rows[0] as CreatePlaceOutput) ?? {};
  }

  type Category = {
    id: string;
    name: string;
    is_active: boolean;
  };

  async function findCategories() {
    const query = {
      text: sql`
        SELECT
          *
        FROM
          categories
      `,
    };

    const queryResult = await placePool.query(query);
    return queryResult?.rows as Category[];
  }
}
