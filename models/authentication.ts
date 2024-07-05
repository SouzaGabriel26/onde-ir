import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { ForgetPasswordEmail } from '@/components/email-templates/ForgetPassword';
import { Welcome } from '@/components/email-templates/Welcome';
import { AuthenticationDataSource } from '@/data/authentication';
import { createUserDataSource } from '@/data/user';
import { emailService } from '@/models/email';
import { ValidationSchema, validator } from '@/models/validator';
import { constants } from '@/src/utils/constants';
import { env } from '@/src/utils/env';
import { Failure, Success, operationResult } from '@/src/utils/operationResult';

type AvailableSignUpFields = keyof SignUpProps;
type AvailableSignInFields = keyof SignInProps;

type AvailableFields = AvailableSignUpFields | AvailableSignInFields;

export type FailureAuthResponse<T = unknown> = {
  message: string;
  fields: Array<AvailableFields | keyof T>;
};

type SuccessAuthSignUpResponse = {
  email: string;
  name: string;
  userName: string;
};

type Payload = {
  sub: string;
  iat: number;
  exp: number;
};

export type SignUpResponse =
  | Failure<FailureAuthResponse>
  | Success<SuccessAuthSignUpResponse>;

export type SignInResponse =
  | Failure<FailureAuthResponse>
  | Success<{
      accessToken: string;
    }>;

type VerifyAccessTokenProps = {
  accessToken?: string;
};

export type ForgetPasswordOutput = Awaited<ReturnType<typeof forgetPassword>>;

type VerifyResetPasswordTokenInput = {
  resetPasswordToken: string;
};

type TokenProps = {
  id: string;
  secretKey: string;
  expiresIn?: string;
};

export type ResetPasswordInput = {
  resetPasswordTokenId: string;
  password: string;
  confirmPassword: string;
};

type ChangePasswordInput = {
  userId: string;
  actualPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const auth = Object.freeze({
  signIn,
  signUp,
  verifyAccessToken,
  forgetPassword,
  verifyResetPasswordToken,
  resetPassword,
  changePassword,
  setInputError,
});

export type SignUpProps = {
  email: ValidationSchema['email'];
  name: ValidationSchema['name'];
  userName: ValidationSchema['userName'];
  password: ValidationSchema['password'];
  confirmPassword: ValidationSchema['confirmPassword'];
};

async function signUp(
  authDataSource: AuthenticationDataSource,
  input: SignUpProps,
): Promise<SignUpResponse> {
  const isPasswordConfirmationValid = input.password === input.confirmPassword;

  if (!isPasswordConfirmationValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'As senhas precisam ser iguais',
      fields: ['password', 'confirmPassword'],
    });
  }

  const insecureInput = {
    email: input.email,
    name: input.name,
    userName: input.userName,
    password: input.password,
    confirmPassword: input.confirmPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    name: 'required',
    email: 'required',
    userName: 'required',
    password: 'required',
    confirmPassword: 'required',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableSignUpFields[],
    });
  }

  const { email, name, password, userName } = secureInput;

  const isEmailAlreadyInUse = await authDataSource.findUserByEmail({ email });
  if (isEmailAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O e-mail já está em uso',
      fields: ['email'],
    });
  }

  const isUserNameAlreadyInUse = await authDataSource.findUserByUserName({
    userName,
  });
  if (isUserNameAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O nome de usuário já está em uso',
      fields: ['userName'],
    });
  }

  const SALT = 12;

  const hashedPassword = bcrypt.hashSync(password, SALT);

  await authDataSource.signUp({
    email,
    name,
    password: hashedPassword,
    userName,
  });

  if (process.env.NODE_ENV !== 'test') {
    await emailService.sendWelcomeMessage({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: Welcome({
        userFirstname: name,
      }),
    });
  }

  return operationResult.success({ email, name, userName });
}

export type SignInProps = {
  email: ValidationSchema['email'];
  password: ValidationSchema['password'];
};

async function signIn(
  authDataSource: AuthenticationDataSource,
  input: SignInProps,
): Promise<SignInResponse> {
  const insecureInput = {
    email: input.email,
    password: input.password,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    email: 'required',
    password: 'required',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableSignInFields[],
    });
  }

  const { email, password } = secureInput;

  const user = await authDataSource.findUserByEmail({ email });
  if (!user) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const accessToken = generateAccessToken({
    id: user.id,
    secretKey: env.jwt_secret,
  });

  return operationResult.success({
    accessToken,
  });
}

function verifyAccessToken({ accessToken }: VerifyAccessTokenProps) {
  if (!accessToken) return null;

  try {
    const payload = jwt.verify(accessToken, env.jwt_secret);

    return payload as Payload;
  } catch {
    cookies().delete(constants.accessTokenKey);
    return null;
  }
}

export type ForgetPasswordInput = {
  email: string;
};

async function forgetPassword(
  authDataSource: AuthenticationDataSource,
  input: ForgetPasswordInput,
) {
  const { data: secureInput, error } = validator(
    {
      email: input.email,
    },
    {
      email: 'required',
    },
  );

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableFields[],
    });
  }

  const { email } = secureInput;

  const userFoundByEmail = await authDataSource.findUserByEmail({ email });
  if (!userFoundByEmail) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Este e-mail não está cadastrado',
      fields: ['email'],
    });
  }

  const forgetPasswordToken = generateAccessToken({
    id: userFoundByEmail.id,
    secretKey: env.reset_password_jwt_secret,
    expiresIn: '5min',
  });

  const { resetPasswordTokenId } =
    await authDataSource.createResetPasswordToken({
      userId: userFoundByEmail.id,
      resetPasswordToken: forgetPasswordToken,
    });

  if (process.env.NODE_ENV !== 'test') {
    await emailService.sendResetPasswordEmail({
      from: 'Onde Ir <onboarding@resend.dev>',
      to: email,
      content: ForgetPasswordEmail({
        userFirstname: userFoundByEmail.name,
        resetPasswordTokenId,
      }),
    });
  }

  return operationResult.success({
    resetPasswordTokenId,
  });
}

async function changePassword(
  authDataSource: AuthenticationDataSource,
  input: ChangePasswordInput,
) {
  const insecureInput = {
    userId: input.userId,
    actualPassword: input.actualPassword,
    newPassword: input.newPassword,
    confirmNewPassword: input.confirmNewPassword,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    userId: 'required',
    actualPassword: 'required',
    newPassword: 'required',
    confirmNewPassword: 'required',
  });

  if (error) {
    return operationResult.failure(error);
  }

  const { userId, actualPassword, newPassword, confirmNewPassword } =
    secureInput;

  const areNewPasswordsEqual = newPassword === confirmNewPassword;
  if (!areNewPasswordsEqual) {
    return operationResult.failure<FailureAuthResponse<ChangePasswordInput>>({
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
    return operationResult.failure<FailureAuthResponse>({
      message: 'Usuário não encontrado',
      fields: [],
    });
  }

  const isPasswordValid = bcrypt.compareSync(actualPassword, user.password!);
  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse<ChangePasswordInput>>({
      message: 'Senha atual inválida',
      fields: ['actualPassword'],
    });
  }

  const SALT = 12;

  const hashedPassword = bcrypt.hashSync(newPassword, SALT);

  await authDataSource.resetPassword({
    password: hashedPassword,
    userId,
  });

  return operationResult.success({});
}

function verifyResetPasswordToken({
  resetPasswordToken,
}: VerifyResetPasswordTokenInput) {
  try {
    const payload = jwt.verify(
      resetPasswordToken,
      env.reset_password_jwt_secret,
    );

    return payload as Payload;
  } catch {
    return null;
  }
}

async function resetPassword(
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
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableFields[],
    });
  }

  const { password, confirmPassword, resetPasswordTokenId } = secureInput;

  if (password !== confirmPassword) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'As senhas precisam ser iguais.',
      fields: ['password', 'confirmPassword'],
    });
  }

  const resetTokenFoundFromId = await authDataSource.findResetPasswordToken({
    where: {
      id: resetPasswordTokenId,
    },
  });

  if (!resetTokenFoundFromId) {
    return operationResult.failure<FailureAuthResponse>({
      message: '"resetPasswordTokenId" inválido.',
      fields: [],
    });
  }

  const { reset_token } = resetTokenFoundFromId;

  const tokenPayload = verifyResetPasswordToken({
    resetPasswordToken: reset_token,
  });

  if (!tokenPayload) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Token inválido',
      fields: [],
    });
  }

  const SALT = 12;
  const hashedPassword = bcrypt.hashSync(password, SALT);

  await authDataSource.resetPassword({
    password: hashedPassword,
    userId: tokenPayload.sub,
  });

  await authDataSource.deleteResetPasswordToken({
    id: input.resetPasswordTokenId,
  });

  return operationResult.success({});
}

function generateAccessToken({ id, secretKey, expiresIn }: TokenProps) {
  const accessToken = jwt.sign(
    {
      sub: id,
    },
    secretKey,
    {
      expiresIn: expiresIn ?? '1d',
    },
  );

  return accessToken;
}

function setInputError(
  inputName: AvailableFields,
  responseMessage: Success<unknown> | Failure<FailureAuthResponse>,
) {
  if (!responseMessage?.error) return '';

  const { message, fields } = responseMessage.error;
  const inputHasError = fields.includes(inputName);

  return inputHasError ? message : '';
}
