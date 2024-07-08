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
      WITH likes_count AS (
        SELECT
          place_id,
          COUNT(*)::INTEGER as likes
        FROM
          place_likes
        GROUP BY
          place_id
      ),
      comments_count AS (
        SELECT
          place_id,
          COUNT(*)::INTEGER AS comments
        FROM
          place_comments
        GROUP BY
          place_id
      )
      SELECT
        places.*,
        ARRAY_AGG(place_images.url) AS images,
        COALESCE(likes_count.likes, 0) AS likes,
        COALESCE(comments_count.comments, 0) AS comments
      FROM
        places
      LEFT JOIN
        place_images ON place_images.place_id = places.id
      LEFT JOIN
        likes_count ON likes_count.place_id = places.id
      LEFT JOIN
        comments_count ON comments_count.place_id = places.id
      $whereClause
      GROUP BY
        places.id,
        likes_count.likes,
        comments_count.comments
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
