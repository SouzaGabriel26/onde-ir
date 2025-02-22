import { database } from '@/infra/database';
import type {
  CreateCommentInput,
  CreatePlaceImagesInput,
  CreatePlaceInput,
  FindCategoriesInput,
  UpdateInput,
} from '@/models/place';
import { sql } from '@/utils/syntax-highlighting';

export type PlaceStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export type PlaceDataSource = ReturnType<typeof createPlaceDataSource>;

export type Category = {
  id: string;
  name: string;
  is_active: boolean;
};

export type CreatePlaceOutput = {
  id: string;
  name: string;
  country: string;
  state: string;
};

export type FindAllPlacesOutput = {
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
  status: PlaceStatus;
  reviewed_by?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  images: string[];
};

export type PlaceComment = {
  id: string;
  place_id: string;
  user_id: string;
  description: string;
  parent_comment_id: string;
  created_at: Date;
  updated_at: Date;
  user_name: string;
  avatar_url: string;
};

export function createPlaceDataSource() {
  const placePool = database.getPool();

  return Object.freeze({
    findAll,
    create,
    createImages,
    findCategories,
    findById,
    update,
    findComments,
    createComment,
    checkCommentById,
  });

  type FindAllInput = {
    limit: number;
    offset: number;
    where?: {
      searchTerm?: string;
      status?: PlaceStatus;
      state?: string;
      name?: string;
      categoryName?: string;
      createdBy?: string;
    };
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
        $joinClause
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

    setJoinClause();
    setWhereClause();

    const queryResult = await placePool.query(query);
    return (queryResult?.rows as Array<FindAllPlacesOutput>) ?? [];

    function setJoinClause() {
      const clauses: string[] = [];

      if (input.where?.categoryName) {
        clauses.push(sql`
          LEFT JOIN categories ON categories.id = places.category_id
        `);
      }

      if (!clauses.length) {
        query.text = query.text.replace('$joinClause', '');
        return;
      }

      query.text = query.text.replace('$joinClause', clauses.join(' '));
    }

    function setWhereClause() {
      const whereClauses = [];

      if (where?.searchTerm) {
        // postgres POSIX operator
        whereClauses.push(sql`name ~* `.concat(`$${++index}`));
        query.values.push(where.searchTerm);
      }

      if (where?.state) {
        whereClauses.push(sql`state = `.concat(`$${++index}`));
        query.values.push(where.state);
      }

      if (where?.name) {
        whereClauses.push(sql`name = `.concat(`$${++index}`));
        query.values.push(where.name);
      }

      if (where?.status) {
        whereClauses.push(sql`status = `.concat(`$${++index}`));
        query.values.push(where.status);
      }

      if (where?.categoryName) {
        whereClauses.push(sql`categories.name = `.concat(`$${++index}`));
        query.values.push(where.categoryName);
      }

      if (where?.createdBy) {
        whereClauses.push(sql`created_by = `.concat(`$${++index}`));
        query.values.push(where.createdBy);
      }

      let whereClauseText = '';
      if (whereClauses.length > 0) {
        whereClauseText = sql`WHERE `.concat(whereClauses.join(' AND '));
      }

      query.text = query.text.replace('$whereClause', whereClauseText);
    }
  }

  async function findById(id: string) {
    const query = {
      text: sql`
        SELECT
          places.*,
          array_remove(ARRAY_AGG(place_images.url), NULL) AS images
        FROM
          places
          LEFT JOIN place_images ON place_images.place_id = places.id
          WHERE
            places.id = $1
        GROUP BY
          places.id
      `,
      values: [id],
    };

    const queryResult = await placePool.query(query);

    if (!queryResult?.rows[0]) return null;

    return queryResult.rows[0] as FindAllPlacesOutput;
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

  async function findCategories({ where }: FindCategoriesInput = {}) {
    const query = {
      text: sql`
        SELECT
          *
        FROM
          categories
        $whereClause
      `,
    };

    setWhereClause();

    const queryResult = await placePool.query(query);

    if (!queryResult || !queryResult.rows) return [];

    return queryResult.rows as Category[];

    function setWhereClause() {
      if (where?.is_active === undefined) {
        query.text = query.text.replace('$whereClause', '');
        return;
      }

      if (where?.is_active !== undefined) {
        query.text = query.text.replace(
          '$whereClause',
          sql`WHERE is_active = `.concat(where.is_active ? 'TRUE' : 'FALSE'),
        );
      }
    }
  }

  async function update(input: UpdateInput) {
    const query = {
      text: sql`
        UPDATE places
        SET
          status = $1,
          reviewed_by = $2,
          updated_at = NOW() AT TIME ZONE 'utc'
        WHERE
          id = $3
      `,
      values: [input.status, input.reviewedBy, input.placeId],
    };

    await placePool.query(query);
  }

  async function findComments(placeId: string) {
    const query = {
      text: sql`
        SELECT
          c.id,
          c.place_id,
          c.user_id,
          c.parent_comment_id,
          c.description,
          c.created_at,
          c.updated_at,
          u.name as user_name,
          u.avatar_url
        FROM
          place_comments c
        INNER JOIN users u ON u.id = c.user_id
        WHERE
          c.place_id = $1
      `,
      values: [placeId],
    };

    const queryResult = await placePool.query(query);

    if (!queryResult || !queryResult.rows) return [];

    return queryResult.rows.map<PlaceComment>((comment) => ({
      id: comment.id,
      place_id: comment.place_id,
      user_id: comment.user_id,
      description: comment.description,
      parent_comment_id: comment.parent_comment_id,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      avatar_url: comment.avatar_url,
      user_name: comment.user_name,
    }));
  }

  async function createComment(input: CreateCommentInput) {
    const query = {
      text: sql`
        INSERT INTO place_comments (
          place_id,
          user_id,
          description,
          parent_comment_id
        )
        VALUES (
          $1,
          $2,
          $3,
          $4
        )
      `,
      values: [
        input.placeId,
        input.userId,
        input.description,
        input.parentCommentId ?? null,
      ],
    };

    await placePool.query(query);
  }

  async function checkCommentById(commentId: string) {
    const queryText = sql`
      SELECT
        id
      FROM
        place_comments
      WHERE
        id = $1
      LIMIT 1
    `;

    const query = {
      text: queryText,
      values: [commentId],
    };

    const queryResult = await placePool.query(query);

    return !!queryResult?.rows[0];
  }
}
