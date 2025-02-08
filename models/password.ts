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
    secretKey: env.reset_password_jwt_secret,
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
    secret: env.reset_password_jwt_secret,
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
  newPassword: string;
  confirmNewPassword: string;
};

async function change(
  authDataSource: AuthenticationDataSource,
  input: ChangePasswordInput,
) {
  const insecureInput = {
    user_id: input.user_id,
    current_password: input.current_password,
    newPassword: input.newPassword,
    confirmNewPassword: input.confirmNewPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    user_id: 'required',
    current_password: 'required',
    newPassword: 'required',
    confirmNewPassword: 'required',
  });

  if (error) {
    return operationResult.failure(error);
  }

  const { user_id, current_password, newPassword, confirmNewPassword } =
    secureInput;

  const areNewPasswordsEqual = newPassword === confirmNewPassword;
  if (!areNewPasswordsEqual) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'As novas senhas precisam ser iguais',
      fields: ['newPassword', 'confirmNewPassword'],
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

  const hashedPassword = hash(newPassword);

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
