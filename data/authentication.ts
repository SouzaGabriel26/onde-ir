import { database } from '@/infra/database';
import type { SignUpProps } from '@/models/authentication';
import { sql } from '@/utils/syntax-highlighting';

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
    findResetPasswordToken,
    invalidateResetPasswordToken,
  });

  type Output = {
    id: string;
    name: string;
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
          name,
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
    user_name: string;
  };

  async function findUserByUserName({ user_name }: FindByUserNameInput) {
    const result = await authenticationPool.query({
      text: sql`
        SELECT
          id,
          password
        FROM
          users
        WHERE
          user_name = $1`,
      values: [user_name],
    });

    return result?.rows[0] as Output | null;
  }

  type SignUpInput = Omit<SignUpProps, 'confirm_password'>;

  async function signUp(input: SignUpInput) {
    const { email, name, password, user_name, avatar_url } = input;

    const query = {
      text: sql`
        INSERT INTO users
          (email, name, password, user_name)
        VALUES
          ($1, $2, $3, $4)
      `,
      values: [email, name, password, user_name],
    };

    if (avatar_url) {
      query.text = sql`
        INSERT INTO users
          (email, name, password, user_name, avatar_url)
        VALUES
          ($1, $2, $3, $4, $5)
      `;
      query.values.push(avatar_url);
    }

    await authenticationPool.query(query);
  }

  type CreateResetPasswordTokenInput = {
    user_id: string;
    resetPasswordToken: string;
  };

  async function createResetPasswordToken(
    input: CreateResetPasswordTokenInput,
  ) {
    const query = {
      text: sql`
        INSERT INTO reset_password_tokens
          (user_id, reset_token)
        VALUES
          ($1, $2)
        RETURNING
          id
      `,
      values: [input.user_id, input.resetPasswordToken],
    };

    const result = await authenticationPool.query(query);
    return {
      reset_password_token_id: String(result?.rows[0].id),
    };
  }

  type FindResetPasswordTokenInput = {
    where: {
      id: string;
    };
  };

  async function findResetPasswordToken({
    where,
  }: FindResetPasswordTokenInput) {
    const result = await authenticationPool.query({
      text: sql`
        SELECT
          id,
          user_id,
          reset_token,
          used,
          created_at
        FROM
          reset_password_tokens
        WHERE
          id = $1
      `,
      values: [where.id],
    });

    if (!result?.rows[0]) return null;

    return result?.rows[0] as {
      id: string;
      user_id: string;
      reset_token: string;
      used: boolean;
      created_at: Date;
    };
  }

  async function invalidateResetPasswordToken({ id }: { id: string }) {
    await authenticationPool.query({
      text: sql`
        UPDATE reset_password_tokens
        SET
          used = TRUE,
          updated_at = NOW() AT TIME ZONE 'UTC'
        WHERE id = $1
      `,
      values: [id],
    });
  }

  type ResetPasswordInput = Pick<SignUpProps, 'password'> & {
    user_id: string;
  };

  async function resetPassword(input: ResetPasswordInput) {
    const { password } = input;

    await authenticationPool.query({
      text: sql`
        UPDATE users
        SET
          password = $1,
          updated_at = NOW() AT TIME ZONE 'UTC'
        WHERE id = $2
      `,
      values: [password, input.user_id],
    });
  }
}
