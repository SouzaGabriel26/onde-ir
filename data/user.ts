import { database } from '@/infra/database';
import { User } from '@/types';
import { sql } from '@/utils/syntax-highlighting';

export type UserDataSource = ReturnType<typeof createUserDataSource>;

export function createUserDataSource() {
  const userPool = database.getPool();

  return Object.freeze({
    findById,
    checkById,
  });

  type FindByIdInput = {
    id: string;
    select: Array<keyof User>;
  };

  async function findById(input: FindByIdInput) {
    const queryText = sql`
      SELECT
        $selectedFields
      FROM
        users
      WHERE
        id = $1
      LIMIT 1
    `;

    const query = {
      text: queryText,
      values: [input.id],
    };

    buildSelectClause();

    const queryResult = await userPool.query(query);

    const foundUser = queryResult?.rows[0];

    if (!foundUser) {
      return null;
    }

    const user: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      password: foundUser.password,
      userName: foundUser.user_name,
      userRole: foundUser.user_role,
      createdAt: foundUser.created_at,
      updatedAt: foundUser.updated_at,
    };

    return JSON.parse(JSON.stringify(user)) as Partial<User>;

    function buildSelectClause() {
      const columnsMap: Record<keyof User, string> = {
        id: 'id',
        email: 'email',
        name: 'name',
        password: 'password',
        userName: 'user_name',
        userRole: 'user_role',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      };

      const select = input.select;
      const columns = [];

      for (const selectColumn of select) {
        const column = columnsMap[selectColumn];
        columns.push(column);
      }

      if (columns.length === 0) {
        columns.push(
          ...Object.values(columnsMap).filter(
            (column) => column !== 'password',
          ),
        );
      }

      query.text = query.text.replace('$selectedFields', columns.join(','));
    }
  }

  type CheckByIdInput = {
    id: string;
  };

  async function checkById({ id }: CheckByIdInput) {
    const queryText = sql`
      SELECT
        id
      FROM
        users
      WHERE
        id = $1
      LIMIT 1
    `;

    const query = {
      text: queryText,
      values: [id],
    };

    const queryResult = await userPool.query(query);

    return queryResult?.rows[0] ? true : false;
  }
}
