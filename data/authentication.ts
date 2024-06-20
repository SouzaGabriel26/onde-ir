import { database } from '@/infra/database';
import { sql } from '@/src/utils/syntax-highlighting';
import { SignUpProps } from '@/types';

export type AuthenticationDataSource = ReturnType<
  typeof createAuthenticationDataSource
>;

export function createAuthenticationDataSource() {
  const authenticationPool = database.getPool();

  return Object.freeze({
    signUp,
    findUserByEmail,
    findUserByUserName,
    createResetPasswordToken,
    resetPassword,
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

  type ResetPasswordTokenInput = {
    userId: string;
    resetPasswordToken: string;
  };

  async function createResetPasswordToken(input: ResetPasswordTokenInput) {
    const query = {
      text: sql`
        INSERT INTO reset_password_tokens
          (user_id, reset_token)
        VALUES
          ($1, $2)
      `,
      values: [input.userId],
    };

    await authenticationPool.query(query);
  }

  type ResetPasswordInput = Pick<SignUpProps, 'password'> & {
    userId: string;
  };

  async function resetPassword(input: ResetPasswordInput) {
    const { password } = input;

    await authenticationPool.query({
      text: sql`
        UPDATE users
        SET password = $1
        WHERE id = $2
      `,
      values: [password, input.userId],
    });
  }
}
