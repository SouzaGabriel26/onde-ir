import { SignJWT, jwtVerify } from 'jose';

import type { AuthenticationDataSource } from '@/data/authentication';
import { password } from '@/models/password';
import { type ValidationSchema, validator } from '@/models/validator';
import { env } from '@/utils/env';
import {
  type Failure,
  type Success,
  operationResult,
} from '@/utils/operationResult';

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
  user_name: string;
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

type VerifyTokenProps = {
  token: string;
  secret: string;
};

type TokenProps = {
  id: string;
  secretKey: string;
  expiresIn?: string;
};

export const auth = Object.freeze({
  signIn,
  signUp,
  verifyToken,
  generateAccessToken,
});

export type SignUpProps = {
  email: ValidationSchema['email'];
  name: ValidationSchema['name'];
  user_name: ValidationSchema['user_name'];
  password: ValidationSchema['password'];
  confirm_password: ValidationSchema['confirm_password'];
  avatar_url?: ValidationSchema['avatar_url'];
};

async function signUp(
  authDataSource: AuthenticationDataSource,
  input: SignUpProps,
): Promise<SignUpResponse> {
  const isPasswordConfirmationValid = input.password === input.confirm_password;

  if (!isPasswordConfirmationValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'As senhas precisam ser iguais',
      fields: ['password', 'confirm_password'],
    });
  }

  const insecureInput = {
    email: input.email,
    name: input.name,
    user_name: input.user_name,
    password: input.password,
    confirm_password: input.confirm_password,
    avatar_url: input.avatar_url,
  };

  const { data: secureInput, error } = validator(insecureInput, {
    name: 'required',
    email: 'required',
    user_name: 'required',
    password: 'required',
    confirm_password: 'required',
    avatar_url: 'optional',
  });

  if (error) {
    return operationResult.failure<FailureAuthResponse>({
      message: error.message,
      fields: error.fields as AvailableSignUpFields[],
    });
  }

  const {
    email,
    name,
    password: userPassword,
    user_name,
    avatar_url,
  } = secureInput;

  const isEmailAlreadyInUse = await authDataSource.findUserByEmail({ email });
  if (isEmailAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O e-mail já está em uso',
      fields: ['email'],
    });
  }

  const isUserNameAlreadyInUse = await authDataSource.findUserByUserName({
    user_name,
  });
  if (isUserNameAlreadyInUse) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'O nome de usuário já está em uso',
      fields: ['user_name'],
    });
  }

  const hashedPassword = password.hash(userPassword);

  await authDataSource.signUp({
    email,
    name,
    password: hashedPassword,
    user_name,
    avatar_url,
  });

  return operationResult.success({ email, name, user_name });
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

  const { email, password: userPassword } = secureInput;

  const user = await authDataSource.findUserByEmail({ email });
  if (!user) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const isPasswordValid = password.compare(userPassword, user.password);
  if (!isPasswordValid) {
    return operationResult.failure<FailureAuthResponse>({
      message: 'Credenciais inválidas',
      fields: ['email', 'password'],
    });
  }

  const accessToken = await generateAccessToken({
    id: user.id,
    secretKey: env.JWT_SECRET_KEY,
    expiresIn: '7d',
  });

  return operationResult.success({
    accessToken,
  });
}

// TODO: move to `tokens` model
async function generateAccessToken({
  id,
  secretKey,
  expiresIn = '1 day',
}: TokenProps) {
  const token = await new SignJWT({ sub: id })
    .setProtectedHeader({
      alg: 'HS256',
      typ: 'JWT',
    })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(new TextEncoder().encode(secretKey));

  return token;
}

async function verifyToken({ token, secret }: VerifyTokenProps) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );

    return payload as Payload;
  } catch {
    return null;
  }
}
