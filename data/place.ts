import { database } from '@/infra/database';
import type { CreatePlaceImagesInput, CreatePlaceInput } from '@/models/place';
import { sql } from '@/utils/syntax-highlighting';

export type PlaceDataSource = ReturnType<typeof createPlaceDataSource>;

export function createPlaceDataSource() {
  const placePool = database.getPool();

  return Object.freeze({
    findAll,
    create,
    createImages,
    findCategories,
    findOneById,
  });

  type FindAllInput = {
    limit: number;
    offset: number;
    where?: {
      approved?: 'true' | 'false';
      state?: string;
      name?: string;
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
    images: string[];
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

      if (where?.name) {
        whereClauses.push(sql`name = `.concat(`$${++index}`));
        query.values.push(where.name);
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

  async function findOneById(id: string) {
    const query = {
      text: sql`
        SELECT
          id,
          name
        FROM
          places
        WHERE
          id = $1;
      `,
      values: [id],
    };

    const queryResult = await placePool.query(query);
    if (!queryResult?.rows[0]) return null;

    return queryResult.rows[0] as {
      id: string;
      name: string;
    };
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
          id, name, country, state;
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
      country: string;
      state: string;
    };

    return (queryResult?.rows[0] as CreatePlaceOutput) ?? {};
  }

  async function createImages({
    place_id,
    description,
    urls,
  }: CreatePlaceImagesInput) {
    let queryText = sql`
      INSERT INTO place_images
      (
        place_id,
        description,
        url
      )
      VALUES
        $values;
    `;

    const queryValues: Array<string> = [];
    let index = 1;

    setValues();

    await placePool.query({
      text: queryText,
      values: queryValues,
    });

    function setValues() {
      const statementValues: string[] = [];

      for (const url of urls) {
        statementValues.push(`($${index}, $${index + 1}, $${index + 2})`);
        queryValues.push(place_id, description, url);
        index += 3;
      }

      queryText = queryText.replace('$values', statementValues.join(','));
    }
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
