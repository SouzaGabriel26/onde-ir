import { sql } from '@/utils/syntax-highlighting';

import { database } from '../infra/database';
import { SignUpProps } from '../models/authentication';

export type AuthenticationDataSource = ReturnType<
  typeof createAuthenticationDataSource
>;

export function createAuthenticationDataSource() {
  const authenticationPool = database.getPool();

  return Object.freeze({
    signUp,
    findUserByEmail,
    findUserByUserName,
  });

  type Output = {
    id: string;
    password: string;
  };

  type FindByEmailInput = {
    email: string;
  };

  async function findUserByEmail({ email }: FindByEmailInput) {
    const result = await authenticationPool.query({
      text: sql`
        SELECT
          id,
          password
        FROM
          users
        WHERE
          email = $1`,
      values: [email],
    });

    return result?.rows[0] as Output | null;
  }

  type FindByUserNameInput = {
    userName: string;
  };

  async function findUserByUserName({ userName }: FindByUserNameInput) {
    const result = await authenticationPool.query({
      text: sql`
        SELECT
          id,
          password
        FROM
          users
        WHERE
          user_name = $1`,
      values: [userName],
    });

    return result?.rows[0] as Output | null;
  }

  type SignUpInput = Omit<SignUpProps, 'confirmPassword'>;

  async function signUp(input: SignUpInput) {
    const { email, name, password, userName } = input;

    await authenticationPool.query({
      text: sql`
        INSERT INTO users
          (email, name, password, user_name)
        VALUES
          ($1, $2, $3, $4)
      `,
      values: [email, name, password, userName],
    });
  }
}