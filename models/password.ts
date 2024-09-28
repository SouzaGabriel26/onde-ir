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

  const { resetPasswordTokenId } =
    await authDataSource.createResetPasswordToken({
      userId: userFoundByEmail.id,
      resetPasswordToken: forgetPasswordToken,
    });

  return operationResult.success({
    resetPasswordTokenId,
    name: userFoundByEmail.name,
  });
}

export type ResetPasswordInput = {
  resetPasswordTokenId: string;
  password: string;
  confirmPassword: string;
};

async function reset(
  authDataSource: AuthenticationDataSource,
  input: ResetPasswordInput,
) {
  const insecureInput = {
    resetPasswordTokenId: input.resetPasswordTokenId,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    password: 'required',
    confirmPassword: 'required',
    resetPasswordTokenId: 'required',
  });

  if (error) {
    return operationResult.failure<PasswordErrorResponse>({
      message: error.message,
      fields: error.fields,
    });
  }

  const { password, confirmPassword, resetPasswordTokenId } = secureInput;

  if (password !== confirmPassword) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'As senhas precisam ser iguais.',
      fields: ['password', 'confirmPassword'],
    });
  }

  const resetTokenFoundFromId = await authDataSource.findResetPasswordToken({
    where: {
      id: resetPasswordTokenId,
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
    userId: tokenPayload.sub,
  });

  await authDataSource.invalidateResetPasswordToken({
    id: input.resetPasswordTokenId,
  });

  return operationResult.success({});
}

export type ChangePasswordInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

async function change(
  authDataSource: AuthenticationDataSource,
  input: ChangePasswordInput,
) {
  const insecureInput = {
    userId: input.userId,
    currentPassword: input.currentPassword,
    newPassword: input.newPassword,
    confirmNewPassword: input.confirmNewPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    userId: 'required',
    currentPassword: 'required',
    newPassword: 'required',
    confirmNewPassword: 'required',
  });

  if (error) {
    return operationResult.failure(error);
  }

  const { userId, currentPassword, newPassword, confirmNewPassword } =
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
    id: userId,
    select: ['password'],
  });

  if (!user) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Usuário não encontrado',
      fields: [],
    });
  }

  const isPasswordValid = compare(currentPassword, user.password!);
  if (!isPasswordValid) {
    return operationResult.failure<PasswordErrorResponse>({
      message: 'Senha atual inválida',
      fields: ['currentPassword'],
    });
  }

  const hashedPassword = hash(newPassword);

  await authDataSource.resetPassword({
    password: hashedPassword,
    userId,
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
