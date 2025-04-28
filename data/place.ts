import { database } from '@/infra/database';
import type {
  CreateCommentInput,
  CreatePlaceImagesInput,
  CreatePlaceInput,
  DeleteCommentInput,
  EvaluateInput,
  FindUserRatingInput,
  LikeCommentInput,
  UpdateInput,
} from '@/models/place';
import type { ValidationSchema } from '@/models/validator';
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
  average_rating?: number;
  images: string[];
  category_name?: string;
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
  likes_count: number;
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
    deleteComment,
    getCommentOwner,
    updateComment,
    evaluate,
    findUserRating,
    likeComment,
    checkCommentLike,
    countPlacesByUser,
    unlikeComment,
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

  type FindCategoriesInput = {
    limit: ValidationSchema['limit'];
    where?: {
      is_active?: boolean;
      id?: string;
    };
  };

  async function findAll(input: FindAllInput) {
    const { limit, offset, where } = input;

    const queryText = sql`
      WITH places_average_rating AS (
        SELECT
          places.id,
          COALESCE(AVG(place_ratings.rating)::FLOAT, 0) AS average_rating
        FROM places
        LEFT JOIN place_ratings ON place_ratings.place_id = places.id
        GROUP BY places.id
      )
      SELECT
        places.*,
        array_remove(ARRAY_AGG(place_images.url), NULL) AS images,
        places_average_rating.average_rating,
        categories.name as category_name
      FROM
        places
        LEFT JOIN place_images ON place_images.place_id = places.id
        LEFT JOIN places_average_rating ON places_average_rating.id = places.id
        LEFT JOIN categories ON categories.id = places.category_id
        $whereClause
      GROUP BY
        places.id, places_average_rating.average_rating, categories.name
      ORDER BY
        places.created_at DESC
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

      if (where?.searchTerm) {
        // postgres POSIX operator
        whereClauses.push(sql`places.name ~* `.concat(`$${++index}`));
        query.values.push(where.searchTerm);
      }

      if (where?.state) {
        whereClauses.push(sql`state = `.concat(`$${++index}`));
        query.values.push(where.state);
      }

      if (where?.name) {
        whereClauses.push(sql`places.name = `.concat(`$${++index}`));
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
        WITH places_average_rating AS (
          SELECT
            places.id,
            COALESCE(AVG(place_ratings.rating)::FLOAT, 0) AS average_rating
          FROM places
          LEFT JOIN place_ratings ON place_ratings.place_id = places.id
          GROUP BY places.id
        )
        SELECT
          places.*,
          array_remove(ARRAY_AGG(place_images.url), NULL) AS images,
          places_average_rating.average_rating
        FROM
          places
        LEFT JOIN place_images ON place_images.place_id = places.id
        INNER JOIN places_average_rating ON places_average_rating.id = places.id
        WHERE
          places.id = $1
        GROUP BY
          places.id, places_average_rating.average_rating;
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

  async function findCategories({ limit, where }: FindCategoriesInput) {
    type Query = {
      text: string;
      values: Array<string | number | boolean>;
    };

    const query: Query = {
      text: sql`
        SELECT
          *
        FROM
          categories
        $whereClause
        LIMIT $1
      `,
      values: [limit],
    };

    setWhereClause();

    const queryResult = await placePool.query(query);

    if (!queryResult || !queryResult.rows) return [];

    return queryResult.rows as Category[];

    function setWhereClause() {
      const clauses = [];

      if (where?.is_active !== undefined) {
        clauses.push(
          sql`is_active = `.concat(where.is_active ? 'TRUE' : 'FALSE'),
        );
      }

      if (where?.id) {
        clauses.push(sql`id = `.concat(`$${query.values.length + 1}`));
        query.values.push(where.id);
      }

      if (clauses.length > 0) {
        query.text = query.text.replace(
          '$whereClause',
          'WHERE '.concat(clauses.join(' AND ')),
        );
      } else {
        query.text = query.text.replace('$whereClause', '');
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
          c.likes_count,
          u.name as user_name,
          u.avatar_url
        FROM
          place_comments c
        INNER JOIN users u ON u.id = c.user_id
        WHERE
          c.place_id = $1
        ORDER BY
          c.created_at DESC
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
      likes_count: comment.likes_count,
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

  async function getCommentOwner(commentId: string) {
    const queryText = sql`
      SELECT
        user_id
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

    if (!queryResult || !queryResult.rows.length) return null;

    return queryResult.rows[0].user_id as string;
  }

  async function deleteComment(input: DeleteCommentInput) {
    const query = sql`
      DELETE FROM
        place_comments
      WHERE
        id = $1
    `;

    await placePool.query({
      text: query,
      values: [input.commentId],
    });
  }

  type UpdateCommentInput = {
    commentId: string;
    description: string;
  };

  async function updateComment(input: UpdateCommentInput) {
    const query = {
      text: sql`
        UPDATE place_comments
        SET
          description = $1,
          updated_at = NOW() AT TIME ZONE 'UTC'
        WHERE
          id = $2;
      `,
      values: [input.description, input.commentId],
    };

    await placePool.query(query);
  }

  async function evaluate(input: EvaluateInput) {
    const query = {
      text: sql`
        INSERT INTO place_ratings (
          place_id,
          user_id,
          rating
        )
        VALUES (
          $1,
          $2,
          $3
        )
      `,
      values: [input.placeId, input.userId, input.evaluation],
    };

    await placePool.query(query);
  }

  async function findUserRating(input: FindUserRatingInput) {
    const query = {
      text: sql`
        SELECT
          id,
          rating
        FROM
          place_ratings
        WHERE
          place_id = $1
          AND user_id = $2
      `,
      values: [input.placeId, input.userId],
    };

    const queryResult = await placePool.query(query);

    if (!queryResult || !queryResult.rows.length) return null;

    return {
      id: String(queryResult.rows[0].id),
      rating: Number(queryResult.rows[0].rating),
    };
  }

  async function checkCommentLike(input: LikeCommentInput) {
    const query = {
      text: sql`
        SELECT
          id
        FROM
          place_comment_likes
        WHERE
          comment_id = $1
          AND user_id = $2
      `,
      values: [input.commentId, input.userId],
    };

    const queryResult = await placePool.query(query);

    if (!queryResult || !queryResult.rows.length) return false;

    return true;
  }

  async function likeComment(input: LikeCommentInput) {
    const query = {
      text: sql`
        INSERT INTO place_comment_likes
          (comment_id, user_id)
        VALUES
          ($1, $2)
      `,
      values: [input.commentId, input.userId],
    };

    await placePool.query(query);
  }

  async function unlikeComment(input: LikeCommentInput) {
    const query = {
      text: sql`
        DELETE FROM
          place_comment_likes
        WHERE
          comment_id = $1
          AND user_id = $2
      `,
      values: [input.commentId, input.userId],
    };

    await placePool.query(query);
  }

  type CountPlacesByUserInput = {
    userId: string;
  };

  async function countPlacesByUser({ userId }: CountPlacesByUserInput) {
    const query = {
      text: sql`
        SELECT
          COUNT(*)
        FROM
          places
        WHERE
          created_by = $1
      `,
      values: [userId],
    };

    const queryResult = await placePool.query(query);

    return Number(queryResult?.rows[0]?.count) ?? 0;
  }
}
