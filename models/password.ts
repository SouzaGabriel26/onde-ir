import bcrypt from 'bcrypt';

import type { AuthenticationDataSource } from '@/data/authentication';
import { createUserDataSource } from '@/data/user';
import { auth } from '@/models/authentication';
import { validator } from '@/models/validator';
import { env } from '@/utils/env';
import { operationResult } from '@/utils/operationResult';

type PasswordErrorResponse = {
  fields: string[];
};

function hash(password: string) {
  const SALT = 12;
  return bcrypt.hashSync(password, SALT);
}

function compare(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export type ForgotPasswordOutput = Awaited<ReturnType<typeof forgot>>;
export type ResetPasswordOutput = Awaited<ReturnType<typeof reset>>;

export type ForgotPasswordInput = {
  email: string;
};

async function forgot(
  authDataSource: AuthenticationDataSource,
  input: ForgotPasswordInput,
) {
  const { data: secureInput, error } = validator(
    { email: input.email },
    { email: 'required' },
  );

  if (error) {
    return operationResult.failure<PasswordErrorResponse>({
      message: error.message,
      fields: error.fields,
    });
  }

  const { email } = secureInput;

  const userFoundByEmail = await authDataSource.findUserByEmail({ email });
  if (!userFoundByEmail) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Este e-mail não está cadastrado',
      fields: ['email'],
    });
  }

  const forgetPasswordToken = await auth.generateAccessToken({
    id: userFoundByEmail.id,
    secretKey: env.RESET_PASSWORD_JWT_SECRET_KEY,
    expiresIn: '5min',
  });

  const { reset_password_token_id } =
    await authDataSource.createResetPasswordToken({
      user_id: userFoundByEmail.id,
      resetPasswordToken: forgetPasswordToken,
    });

  return operationResult.success({
    reset_password_token_id,
    name: userFoundByEmail.name,
  });
}

export type ResetPasswordInput = {
  reset_password_token_id: string;
  password: string;
  confirm_password: string;
};

async function reset(
  authDataSource: AuthenticationDataSource,
  input: ResetPasswordInput,
) {
  const insecureInput = {
    reset_password_token_id: input.reset_password_token_id,
    password: input.password,
    confirm_password: input.confirm_password,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    password: 'required',
    confirm_password: 'required',
    reset_password_token_id: 'required',
  });

  if (error) {
    return operationResult.failure<PasswordErrorResponse>({
      message: error.message,
      fields: error.fields,
    });
  }

  const { password, confirm_password, reset_password_token_id } = secureInput;

  if (password !== confirm_password) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'As senhas precisam ser iguais.',
      fields: ['password', 'confirm_password'],
    });
  }

  const resetTokenFoundFromId = await authDataSource.findResetPasswordToken({
    where: {
      id: reset_password_token_id,
    },
  });

  if (!resetTokenFoundFromId || resetTokenFoundFromId.used) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Token inválido.',
      fields: [],
    });
  }

  const { reset_token } = resetTokenFoundFromId;

  const tokenPayload = await auth.verifyToken({
    token: reset_token,
    secret: env.RESET_PASSWORD_JWT_SECRET_KEY,
  });

  if (!tokenPayload) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Token inválido',
      fields: [],
    });
  }

  const hashedPassword = hash(password);

  await authDataSource.resetPassword({
    password: hashedPassword,
    user_id: tokenPayload.sub,
  });

  await authDataSource.invalidateResetPasswordToken({
    id: input.reset_password_token_id,
  });

  return operationResult.success({});
}

export type ChangePasswordInput = {
  user_id: string;
  current_password: string;
  new_password: string;
  confirm_new_password: string;
};

async function change(
  authDataSource: AuthenticationDataSource,
  input: ChangePasswordInput,
) {
  const insecureInput = {
    user_id: input.user_id,
    current_password: input.current_password,
    new_password: input.new_password,
    confirm_new_password: input.confirm_new_password,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    user_id: 'required',
    current_password: 'required',
    new_password: 'required',
    confirm_new_password: 'required',
  });

  if (error) {
    return operationResult.failure(error);
  }

  const { user_id, current_password, new_password, confirm_new_password } =
    secureInput;

  const areNewPasswordsEqual = new_password === confirm_new_password;
  if (!areNewPasswordsEqual) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'As novas senhas precisam ser iguais',
      fields: ['new_password', 'confirm_new_password'],
    });
  }

  const userDataSource = createUserDataSource();
  const user = await userDataSource.findById({
    id: user_id,
    select: ['password'],
  });

  if (!user) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Usuário não encontrado',
      fields: [],
    });
  }

  const isPasswordValid = compare(current_password, user.password!);
  if (!isPasswordValid) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Senha atual inválida',
      fields: ['current_password'],
    });
  }

  const hashedPassword = hash(new_password);

  await authDataSource.resetPassword({
    password: hashedPassword,
    user_id,
  });

  return operationResult.success({});
}

export const password = Object.freeze({
  hash,
  compare,
  forgot,
  reset,
  change,
});
